import hasCpuAndMemory from '../clusterDetailsHelper';
import { clusterDetails } from './ClusterDetails.fixtures';

describe('hasCpuAndMemory', () => {
  let metrics = null;

  beforeEach(() => {
    metrics = { ...clusterDetails.cluster.metrics };
  });

  it('returns false when there is no cpu', () => {
    metrics.cpu = undefined;
    expect(hasCpuAndMemory(metrics.cpu, metrics.memory)).toBe(false);
  });

  it('returns false when there is no memory', () => {
    metrics.memory = undefined;
    expect(hasCpuAndMemory(metrics.cpu, metrics.memory)).toBe(false);
  });

  it('returns false when there is no memory timestamp', () => {
    metrics.memory.updated_timestamp = '0001-01-01T00:00:00Z';
    expect(hasCpuAndMemory(metrics.cpu, metrics.memory)).toBe(false);
  });

  it('returns false when there is no cpu timestamp', () => {
    metrics.cpu.updated_timestamp = '0001-01-01T00:00:00Z';
    expect(hasCpuAndMemory(metrics.cpu, metrics.memory)).toBe(false);
  });

  it('returns true when there is memory and cpu data', () => {
    metrics.cpu.updated_timestamp = new Date();
    metrics.memory.updated_timestamp = new Date();
    expect(hasCpuAndMemory(metrics.cpu, metrics.memory)).toBe(true);
  });
});
