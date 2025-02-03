import { constants } from '~/components/clusters/common/CreateOSDFormConstants';

import { computeNodeHintText } from './AutoScaleHelper';

describe('AutoScaleHelper.js', () => {
  describe('computeNodeHintText', () => {
    it('returns HCP wizard help text', () => {
      const isHypershiftWizard = true;
      const isAddEditHypershiftModal = false;
      expect(computeNodeHintText(isHypershiftWizard, isAddEditHypershiftModal)).toEqual(
        constants.hcpComputeNodeCountHintWizard,
      );

      expect(computeNodeHintText(isHypershiftWizard)).toEqual(
        constants.hcpComputeNodeCountHintWizard,
      );
    });

    it('returns HCP edit/add machine pool help text', () => {
      const isHypershiftWizard = false;
      const isAddEditHypershiftModal = true;
      expect(computeNodeHintText(isHypershiftWizard, isAddEditHypershiftModal)).toEqual(
        constants.hcpComputeNodeCountHint,
      );
    });

    it('returns classic/osd help text', () => {
      const isHypershiftWizard = false;
      const isAddEditHypershiftModal = false;
      expect(computeNodeHintText(isHypershiftWizard, isAddEditHypershiftModal)).toEqual(
        constants.computeNodeCountHint,
      );

      expect(computeNodeHintText()).toEqual(constants.computeNodeCountHint);
    });
  });
});
