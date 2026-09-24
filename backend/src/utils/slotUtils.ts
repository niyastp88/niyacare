export const generateSlots = (
  startTime: string,
  dailyTokens: number,
): string[] => {
  const slots: string[] = [];

  const [hours, minutes] = startTime.split(":").map(Number);

  const startMinutes = hours * 60 + minutes;

  for (let i = 0; i < dailyTokens; i++) {
    const totalMinutes = startMinutes + i * 5;
    const slotHours = Math.floor(totalMinutes / 60);
    const slotMinutes = totalMinutes % 60;
    const formattedHours = String(slotHours).padStart(2, "0");
    const formattedMinutes = String(slotMinutes).padStart(2, "0");

    slots.push(`${formattedHours}:${formattedMinutes}`);
  }

  return slots;
};
