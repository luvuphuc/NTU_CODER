import moment from 'moment-timezone';

export const formatTimeFromNow = (dateString) => {
  const dateVN = moment.utc(dateString).tz('Asia/Ho_Chi_Minh');
  const now = moment().tz('Asia/Ho_Chi_Minh');
  const diffMinutes = now.diff(dateVN, 'minutes');
  const diffHours = now.diff(dateVN, 'hours');
  const diffDays = now.diff(dateVN, 'days');

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 2) return `${diffDays} ngày trước`;

  return dateVN.format('D [tháng] M [lúc] HH:mm');
};
