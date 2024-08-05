import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { DateRangePicker as MuiDateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import EventIcon from '@mui/icons-material/Event';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onChange: (newValue: [Dayjs | null, Dayjs | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const formatDateRange = (start: Dayjs | null, end: Dayjs | null) => {
    if (start && end) {
      return `${start.format('YYYY/MM/DD')} - ${end.format('YYYY/MM/DD')}`;
    } else if (start) {
      return start.format('YYYY/MM/DD');
    } else if (end) {
      return end.format('YYYY/MM/DD');
    }
    return '';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDateRangePicker
        value={[startDate, endDate]}
        onChange={onChange}
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
            placeholder="选择日期范围"
            value={formatDateRange(startDate, endDate)}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;