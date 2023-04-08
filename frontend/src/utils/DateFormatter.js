import React from "react";
import Moment from "react-moment";
import "moment/locale/vi";
const DateFormatter = ({ date }) => {
  return (
    <Moment interval={1000} locale="vi" fromNow withTitle>
      {date}
    </Moment>
    // <Moment locale="vi" format="D MMMM YYYY" withTitle>
    //   {date}
    // </Moment>
  );
};

export const DateConverter = ({ date }) => {
  return (
    <Moment locale="vi" format="D/MM/YY" withTitle>
      {date}
    </Moment>
  );
};

export default DateFormatter;
