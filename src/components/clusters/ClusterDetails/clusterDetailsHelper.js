import has from 'lodash/has';
import { getCountdown } from '../../../common/helpers';

const hasCpuAndMemory = (cpu, memory) => {
  const totalCPU = has(cpu, 'total.value');
  const totalMemory = has(memory, 'total.value');
  const cpuTimeStampEmpty = has(cpu, 'updated_timestamp') && new Date(cpu.updated_timestamp).getTime() < 0;
  const memoryTimeStampEmpty = has(memory, 'updated_timestamp') && new Date(memory.updated_timestamp).getTime() < 0;

  if (!cpu || !memory || cpuTimeStampEmpty || memoryTimeStampEmpty || !totalCPU || !totalMemory) {
    return false;
  }
  return true;
};

export const getRoundedCountdown = (timeString) => {
  const countdown = getCountdown(timeString);
  if (Object.values(countdown).every(value => value <= 0)) {
    return countdown;
  }
  // n days, m hours ~~ n+1 days
  if (countdown.days !== 0 && countdown.hours !== 0) {
    countdown.days += 1;
    countdown.hours = 0;
    countdown.minutes = 0;
  }
  return countdown;
};

export default hasCpuAndMemory;
