import React, { useState } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import EventIcon from '@mui/icons-material/Event';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onChange: (dates: [Dayjs | null, Dayjs | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  const handleDateChange = (date: Dayjs | null) => {
    if (!isSelectingEndDate) {
      onChange([date, null]);
      setIsSelectingEndDate(true);
    } else {
      if (date && startDate && date.isBefore(startDate)) {
        onChange([date, startDate]);
      } else {
        onChange([startDate, date]);
      }
      setIsSelectingEndDate(false);
    }
  };

  const formatDateRange = (start: Dayjs | null, end: Dayjs | null) => {
    if (start && end) {
      return `${start.format('YYYY/MM/DD')} - ${end.format('YYYY/MM/DD')}`;
    } else if (start) {
      return start.format('YYYY/MM/DD');
    }
    return '';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DatePicker
          value={isSelectingEndDate ? endDate : startDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon />
                  </InputAdornment>
                ),
              }}
              placeholder={isSelectingEndDate ? "选择结束日期（可选）" : "选择开始日期"}
              value={formatDateRange(startDate, endDate)}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;