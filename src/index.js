import React from "react";
import ReactDOM from "react-dom";
import { times, flatten, reduce, each, map, compact } from "lodash";
import HourSelect from "./HourSelect";

import "./styles.css";

var days_selected = {};
const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
class App extends React.Component {
  state = {
    log: {},
    select_all: false,
    selected_start: "0:00",
    selected_end: "23:00",
    days: reduce(
      days,
      (acc, d) => {
        acc[d] = { start: "0:00", end: "23:00", select: false, day: d };
        return acc;
      },
      {}
    )
  };

  render() {
    const hours = times(24, item => {
      return [item + ":00", item + ":30"];
    });

    const flattenedHours = flatten(hours);

    return (
      <div className="App">
        <h1>Openning Hours editor</h1>

        <fieldset>
          <legend>Pick the day</legend>

          <table>
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="feature"
                    onChange={this.handleAllDaysSelect}
                  />
                  Todos dias
                </label>
              </td>
              <td>
                <HourSelect
                  options={flattenedHours}
                  id="all_start"
                  value={this.state.selected_start}
                  onChange={e => this.handleAllDaysHours(e, "start")}
                />
              </td>
              <td>
                <HourSelect
                  options={flattenedHours}
                  id="all_end"
                  value={this.state.selected_end}
                  onChange={e => this.handleAllDaysHours(e, "end")}
                />
              </td>
            </tr>

            {map(this.state.days, (v, k) => (
              <tr>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      name="feature"
                      checked={v.select}
                      id={k}
                      value={k}
                      onChange={this.handleDaySelected}
                    />
                    {k}
                  </label>
                </td>
                <td>
                  <HourSelect
                    options={flattenedHours}
                    id={k + "_start"}
                    onChange={e => this.handleHoursSelected(e, k, "start")}
                    value={v.start}
                  />
                </td>
                <td>
                  <HourSelect
                    options={flattenedHours}
                    id={k + "_end"}
                    onChange={e => this.handleHoursSelected(e, k, "end")}
                    value={v.end}
                  />
                </td>
              </tr>
            ))}
          </table>
        </fieldset>
        <br />
        <fieldset>
          <legend>Output</legend>
          {this.formatDays()}
        </fieldset>
      </div>
    );
  }

  formatDays = daysObj => {
    const daysStr = map(this.state.days, (v, k) => {
      if (v.select) {
        return `${k} ${v.start} ${v.end}`;
      }
    });

    return compact(daysStr).join(" - ");
  };

  handleDaySelected = ({ target }) => {
    this.updateDay(target.value, { select: target.checked });
  };

  handleHoursSelected = ({ target }, week_day, action) => {
    this.updateDay(week_day, { [action]: target.value, select: true });
  };

  handleAllDaysSelect = ({ target }) => {
    this.updateAllDays({ select: target.checked });
  };

  handleAllDaysHours = ({ target }, action) => {
    const action_key = `selected_${action}`;
    this.setState({ [action_key]: target.value });
    this.updateAllDays({ [action]: target.value });
  };

  updateAllDays = updates => {
    const temp = reduce(
      this.state.days,
      (acc, day, key) => {
        acc[key] = { ...day, ...updates };
        return acc;
      },
      {}
    );

    this.setState({ days: temp });
  };

  updateDay = (week_day, updates) => {
    const temp_days = this.state.days;
    temp_days[week_day] = { ...temp_days[week_day], ...updates };
    this.setState({ days: temp_days });
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
