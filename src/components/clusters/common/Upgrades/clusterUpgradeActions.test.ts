/* eslint-disable no-unused-vars */
import createMockStore from 'redux-mock-store';

import {
  deleteControlPlaneUpgradeSchedule,
  deleteUpgradeSchedule,
  getControlPlaneUpgradeSchedules,
  getUpgradeSchedules,
  getUpgradeScheduleState,
  patchControlPlaneUpgradeSchedule,
  patchUpgradeSchedule,
  postControlPlaneUpgradeSchedule,
  postUpgradeSchedule,
} from '../../../../services/clusterService';

import {
  CLEAR_DELETE_UPGRADE_SCHEDULE,
  CLEAR_GET_UPGRADE_SCHEDULE,
  CLEAR_POST_UPGRADE_SCHEDULE,
  clearDeleteScheduleResponse,
  clearPostedUpgradeScheduleResponse,
  clearSchedulesResponse,
  deleteSchedule,
  editSchedule,
  getSchedules,
  postSchedule,
  replaceSchedule,
  SET_CLUSTER_UPGRADE_POLICY,
  setAutomaticUpgradePolicy,
} from './clusterUpgradeActions';
import { initialState } from './clusterUpgradeReducer';

jest.mock('../../../../services/clusterService', () => ({
  getControlPlaneUpgradeSchedules: jest.fn(),
  getUpgradeSchedules: jest.fn(),
  getUpgradeScheduleState: jest.fn(),
  postControlPlaneUpgradeSchedule: jest.fn(),
  postUpgradeSchedule: jest.fn(),
  deleteControlPlaneUpgradeSchedule: jest.fn(),
  deleteUpgradeSchedule: jest.fn(),
  patchControlPlaneUpgradeSchedule: jest.fn(),
  patchUpgradeSchedule: jest.fn(),
}));
describe('clusterUpgradeActions', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('setAutomaticUpgradePolicy', () =>
    expect(setAutomaticUpgradePolicy({ id: 'id' })).toStrictEqual({
      type: SET_CLUSTER_UPGRADE_POLICY,
      payload: { id: 'id' },
    }));

  it('clearSchedulesResponse', () => {
    clearSchedulesResponse()(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: CLEAR_GET_UPGRADE_SCHEDULE,
    });
  });

  it('clearPostedUpgradeScheduleResponse', () => {
    clearPostedUpgradeScheduleResponse()(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: CLEAR_POST_UPGRADE_SCHEDULE,
    });
  });

  it('clearDeleteScheduleResponse', () => {
    clearDeleteScheduleResponse()(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: CLEAR_DELETE_UPGRADE_SCHEDULE,
    });
  });

  describe('schedules', () => {
    const mockStore = createMockStore();
    const store = mockStore(initialState);
    const schedule = {
      cluster_id: 'cluster_id',
      id: 'id',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getSchedules', () => {
      it('when isHypershift is true', async () => {
        // Arrange
        (getControlPlaneUpgradeSchedules as jest.Mock).mockResolvedValueOnce({
          data: { items: [schedule] },
        });

        // Act
        const payload = await Promise.resolve(
          store.dispatch(getSchedules('clusterID', true)).payload,
        );

        // Assert
        expect(getUpgradeSchedules).toHaveBeenCalledTimes(0);
        expect(getControlPlaneUpgradeSchedules).toHaveBeenCalledTimes(1);
        expect(getControlPlaneUpgradeSchedules).toHaveBeenCalledWith('clusterID');
        expect(getUpgradeScheduleState).toHaveBeenCalledTimes(0);
        expect(payload.data.items?.length).toBe(1);
        expect(payload.data.items?.[0]).toStrictEqual(schedule);
      });

      it('when isHypershift is false', async () => {
        // Arrange
        (getUpgradeSchedules as jest.Mock).mockResolvedValueOnce({ data: { items: [schedule] } });
        (getUpgradeScheduleState as jest.Mock).mockResolvedValueOnce({ data: 'ready' });

        // Act
        const payload = await Promise.resolve(
          store.dispatch(getSchedules('clusterID', false)).payload,
        );

        // Assert
        expect(getControlPlaneUpgradeSchedules).toHaveBeenCalledTimes(0);
        expect(getUpgradeSchedules).toHaveBeenCalledTimes(1);
        expect(getUpgradeSchedules).toHaveBeenCalledWith('clusterID');
        expect(getUpgradeScheduleState).toHaveBeenCalledTimes(1);
        expect(getUpgradeScheduleState).toHaveBeenCalledWith(schedule.cluster_id, schedule.id);
        expect(payload.data.items?.length).toBe(1);
        expect(payload.data.items?.[0]).toStrictEqual({
          ...schedule,
          state: 'ready',
        });
      });

      it('when isHypershift is false and items undefined', async () => {
        // Arrange
        (getUpgradeSchedules as jest.Mock).mockResolvedValueOnce({ data: { items: undefined } });

        // Act
        const payload = await Promise.resolve(
          store.dispatch(getSchedules('clusterID', false)).payload,
        );

        // Assert
        expect(getControlPlaneUpgradeSchedules).toHaveBeenCalledTimes(0);
        expect(getUpgradeSchedules).toHaveBeenCalledTimes(1);
        expect(getUpgradeSchedules).toHaveBeenCalledWith('clusterID');
        expect(getUpgradeScheduleState).toHaveBeenCalledTimes(0);
        expect(payload.data.items?.length).toBe(0);
      });

      it('when isHypershift is false and items empty', async () => {
        // Arrange
        (getUpgradeSchedules as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

        // Act
        const payload = await Promise.resolve(
          store.dispatch(getSchedules('clusterID', false)).payload,
        );

        // Assert
        expect(getControlPlaneUpgradeSchedules).toHaveBeenCalledTimes(0);
        expect(getUpgradeSchedules).toHaveBeenCalledTimes(1);
        expect(getUpgradeSchedules).toHaveBeenCalledWith('clusterID');
        expect(getUpgradeScheduleState).toHaveBeenCalledTimes(0);
        expect(payload.data.items?.length).toBe(0);
      });
    });

    describe('postSchedule', () => {
      it('when isHypershift is true', () => {
        // Arrange
        (postControlPlaneUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        postSchedule('clusterID', schedule, true)(store.dispatch);

        // Assert
        expect(postUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule);
      });

      it('when isHypershift is false', () => {
        // Arrange
        (postUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        postSchedule('clusterID', schedule, false)(store.dispatch);

        // Assert
        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(postUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(postUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule);
      });
    });

    describe('replaceSchedule', () => {
      const newSchedule = {
        cluster_id: 'cluster_id2',
        id: 'id2',
      };
      it('when isHypershift is true', async () => {
        // Arrange
        (deleteControlPlaneUpgradeSchedule as jest.Mock).mockResolvedValueOnce({});
        (postControlPlaneUpgradeSchedule as jest.Mock).mockResolvedValueOnce({});

        // Act
        await Promise.resolve(
          replaceSchedule('clusterID', schedule.id, newSchedule, true)(store.dispatch),
        );

        // Assert
        expect(deleteUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(postUpgradeSchedule).toHaveBeenCalledTimes(0);

        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule.id);

        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledWith('clusterID', newSchedule);
      });
      it('when isHypershift is false', async () => {
        // Arrange
        (deleteUpgradeSchedule as jest.Mock).mockResolvedValueOnce({});
        (postUpgradeSchedule as jest.Mock).mockResolvedValueOnce({});

        // Act
        await Promise.resolve(
          replaceSchedule('clusterID', schedule.id, newSchedule, false)(store.dispatch),
        );

        // Assert
        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(postControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(0);

        expect(deleteUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(deleteUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule.id);

        expect(postUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(postUpgradeSchedule).toHaveBeenCalledWith('clusterID', newSchedule);
      });
    });

    describe('editSchedule', () => {
      it('when isHypershift is true', () => {
        // Arrange
        (patchControlPlaneUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        editSchedule('clusterID', 'policyID', schedule, true)(store.dispatch);

        // Assert
        expect(patchUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(patchControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(patchControlPlaneUpgradeSchedule).toHaveBeenCalledWith(
          'clusterID',
          'policyID',
          schedule,
        );
      });

      it('when isHypershift is false', () => {
        // Arrange
        (patchUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        editSchedule('clusterID', 'policyID', schedule, false)(store.dispatch);

        // Assert
        expect(patchControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(patchUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(patchUpgradeSchedule).toHaveBeenCalledWith('clusterID', 'policyID', schedule);
      });
    });

    describe('deleteSchedule', () => {
      it('when isHypershift is true', () => {
        // Arrange
        (deleteControlPlaneUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        deleteSchedule('clusterID', schedule.id, true)(store.dispatch);

        // Assert
        expect(deleteUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule.id);
      });

      it('when isHypershift is false', () => {
        // Arrange
        (deleteUpgradeSchedule as jest.Mock).mockResolvedValueOnce('response');

        // Act
        deleteSchedule('clusterID', schedule.id, false)(store.dispatch);

        // Assert
        expect(deleteControlPlaneUpgradeSchedule).toHaveBeenCalledTimes(0);
        expect(deleteUpgradeSchedule).toHaveBeenCalledTimes(1);
        expect(deleteUpgradeSchedule).toHaveBeenCalledWith('clusterID', schedule.id);
      });
    });
  });
});
