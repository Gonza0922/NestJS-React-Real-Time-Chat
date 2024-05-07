export const getDateAndHours = (dateISO: string) => {
  const date = new Date(dateISO);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const formattedDate = month + "/" + day;
  const formattedHour = hours + ":" + minutes;

  return `${formattedDate} ${formattedHour}`;
};
