import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
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
  const handleDateChange = (date: Dayjs | null) => {
    if (!startDate || (startDate && endDate)) {
      // 如果没有开始日期，或者已经选择了开始和结束日期，则重新开始选择
      onChange([date, null]);
    } else {
      // 如果已经有开始日期，则设置结束日期
      if (date && date.isBefore(startDate)) {
        // 如果选择的日期早于开始日期，交换它们
        onChange([date, startDate]);
      } else {
        onChange([startDate, date]);
      }
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
      <DatePicker
        value={startDate}
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
            placeholder="选择日期或日期范围"
            value={formatDateRange(startDate, endDate)}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;