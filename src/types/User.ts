import dayjs from 'dayjs';
export default interface User {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | dayjs.Dayjs | null;
  language: string | null;
}
