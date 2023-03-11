import React from "react";
import Moment from "react-moment";
import "moment/locale/vi";
const DateFormatter = ({ date }) => {
  return (
    <Moment locale="vi" format="D MMMM YYYY" withTitle>
      {date}
    </Moment>
  );
};

export default DateFormatter;
