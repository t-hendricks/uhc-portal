import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';

import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  DrawerHead,
  Flex,
  FlexItem,
  Gallery,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  Title,
} from '@patternfly/react-core';

import {
  getInstalled,
  hasQuota,
  validateAddOnRequirements,
  getAddOnBillingQuota,
} from '../AddOnsHelper';
import AddOnsCard from '../AddOnsCard';
import AddOnStateLabel from '../AddOnStateLabel';
import AddOnsParametersModal from '../AddOnsParametersModal';
import AddOnsDeleteModal from '../AddOnsDeleteModal';
import AddOnsParameterList from './AddOnsDrawerParameterList';
import AddOnsPrimaryButton from './AddOnsDrawerPrimaryButton';
import AddOnsMetaDataItem from './AddOnsDrawerMetadataItem';
import AddOnsRequirementContent from './AddOnsDrawerRequirementContent';
import AddOnsFailedBox from './AddOnsDrawerFailedBox';
import AddOnsSubscription from './AddOnsSubscription';
import AddOnsConstants from '../AddOnsConstants';

class AddOnsDrawer extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      addClusterAddOnResponse,
      deleteClusterAddOnResponse,
      submitClusterAddOnResponse,
      drawer,
      setAddonsDrawer,
    } = this.props;

    if (
      (addClusterAddOnResponse.fulfilled && prevProps.addClusterAddOnResponse.pending) ||
      (deleteClusterAddOnResponse.fulfilled && prevProps.deleteClusterAddOnResponse.pending) ||
      (submitClusterAddOnResponse.fulfilled && prevProps.submitClusterAddOnResponse.pending)
    ) {
      // close drawer when cluster is added, updated or deleted
      if (drawer.open) {
        setAddonsDrawer({
          open: false,
          activeCard: null,
        });
      }
    }
  }

  // check if user has quota for addons
  getHasQuota = (addOn) => {
    const { cluster, organization, quota } = this.props;
    return addOn !== null ? hasQuota(addOn, cluster, organization, quota) : false;
  };

  // return installed addon
  getInstalledAddon = (addOn) => {
    const { clusterAddOns } = this.props;

    return getInstalled(addOn, clusterAddOns);
  };

  // toggle currently active tab
  handleTabClick = (event, tabIndex) => {
    const { setAddonsDrawer } = this.props;
    setAddonsDrawer({
      activeTabKey: tabIndex,
    });
    event.preventDefault();
  };

  // handles card click
  handleCardClick = (addOn) => () => {
    const { clusterAddOns, quota, setAddonsDrawer, drawer } = this.props;

    // if activeCard is clicked again close drawer
    if (addOn.id === drawer.activeCard?.id) {
      this.handleCloseDrawer();
      return;
    }

    // get installedAddon
    const installedAddOn = getInstalled(addOn, clusterAddOns);

    // get addOn requirements
    const requirements = validateAddOnRequirements(addOn);

    // get billing / quota info
    const billingQuota = getAddOnBillingQuota(addOn, quota);

    setAddonsDrawer({
      // set active card states
      activeCard: addOn,
      // set requirements state
      activeCardRequirementsFulfilled: requirements.fulfilled,
      activeCardRequirements: requirements.errorMsgs,
      // set installed addon
      installedAddOn,
      // set billing model
      billingQuota,
      // set drawer state
      open: true,
      activeTabKey: 0,
    });
  };

  // handle close drawer, reset state back to null
  handleCloseDrawer = () => {
    const { setAddonsDrawer } = this.props;
    setAddonsDrawer({
      activeCard: null,
      activeCardRequirements: null,
      activeCardRequirementsFulfilled: true,
      open: false,
      activeTabKey: 0,
    });
  };

  render() {
    const {
      addClusterAddOn,
      addClusterAddOnResponse,
      updateClusterAddOn,
      addOnsList,
      cluster,
      openModal,
      setAddonsDrawer,
      drawer,
    } = this.props;

    const {
      open,
      // current selected addon info
      activeCard,
      // current selected installed addon info
      installedAddOn,
      // current selected addon requirements
      activeCardRequirements,
      activeCardRequirementsFulfilled,
      // current billing model
      billingQuota,
      // current drawer state
      activeTabKey,
      subscriptionModels,
    } = drawer;

    // panel content for selected active card
    const panelContent = (
      <DrawerPanelContent className="ocm-c-addons__drawer--panel-content">
        <DrawerHead className="ocm-c-addons__drawer--header">
          <Grid hasGutter>
            <GridItem span={3}>
              {activeCard?.icon && (
                <img alt={activeCard?.name} src={`data:image/png;base64,${activeCard?.icon}`} />
              )}
            </GridItem>
            <GridItem span={9}>
              <Title headingLevel="h2" size="xl">
                {activeCard?.name}
              </Title>
            </GridItem>
          </Grid>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleCloseDrawer} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <AddOnStateLabel
            addOn={activeCard}
            requirements={validateAddOnRequirements(activeCard)}
            installedAddOn={installedAddOn}
          />
          <AddOnsFailedBox installedAddOn={installedAddOn} />
        </DrawerPanelBody>
        <div>
          <Tabs
            activeKey={activeTabKey}
            onSelect={this.handleTabClick}
            inset={{
              default: 'insetNone',
              md: 'insetSm',
              xl: 'inset2xl',
              '2xl': 'insetLg',
            }}
          >
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
              <DrawerPanelBody className="ocm-addons-tab--drawer-panel-body">
                <Flex spaceItems={{ default: 'spaceItemsLg' }} direction={{ default: 'column' }}>
                  <FlexItem>{activeCard?.description}</FlexItem>
                  <AddOnsMetaDataItem
                    activeCardDocsLink={activeCard?.docs_link}
                    installedAddOnOperatorVersion={installedAddOn?.operator_version}
                  />
                  <AddOnsParameterList
                    installedAddOn={installedAddOn}
                    activeCard={activeCard}
                    activeCardID={activeCard?.id}
                    installedAddOnState={installedAddOn?.state}
                    cluster={cluster}
                    openModal={openModal}
                  />
                  <AddOnsSubscription
                    activeCardId={activeCard?.id}
                    billingQuota={billingQuota}
                    installedAddOn={installedAddOn}
                    subscriptionModels={subscriptionModels}
                    setAddonsDrawer={setAddonsDrawer}
                  />
                </Flex>
              </DrawerPanelBody>
              {installedAddOn?.state === AddOnsConstants.INSTALLATION_STATE.DELETING ? null : (
                <DrawerPanelBody>
                  <AddOnsPrimaryButton
                    activeCard={activeCard}
                    activeCardRequirementsFulfilled={activeCardRequirementsFulfilled}
                    addClusterAddOn={addClusterAddOn}
                    addClusterAddOnResponse={addClusterAddOnResponse}
                    updateClusterAddOn={updateClusterAddOn}
                    cluster={cluster}
                    hasQuota={this.getHasQuota(activeCard)}
                    installedAddOn={installedAddOn}
                    installedAddOnOperatorVersion={installedAddOn?.operator_version}
                    openModal={openModal}
                    subscriptionModels={subscriptionModels}
                  />
                </DrawerPanelBody>
              )}
            </Tab>
            {!activeCardRequirementsFulfilled && (
              <Tab eventKey={1} title={<TabTitleText>Prerequisites</TabTitleText>}>
                <DrawerPanelBody className="ocm-addons-tab--drawer-panel-body">
                  <Flex spaceItems={{ default: 'spaceItemsLg' }} direction={{ default: 'column' }}>
                    <FlexItem>
                      <AddOnsRequirementContent activeCardRequirements={activeCardRequirements} />
                    </FlexItem>
                  </Flex>
                </DrawerPanelBody>
              </Tab>
            )}
          </Tabs>
        </div>
      </DrawerPanelContent>
    );

    return (
      <>
        <Drawer
          isExpanded={open}
          isInline
          className="ocm-addons-tab--addon-drawer pf-m-inline-on-2xl"
        >
          <DrawerContent
            panelContent={activeCard ? panelContent : null}
            className="pf-m-no-background ocm-c-addons__drawer--panel-gallery"
          >
            <DrawerContentBody>
              <Gallery hasGutter>
                {addOnsList.map((addOn) => (
                  <AddOnsCard
                    key={addOn.id}
                    addOn={addOn}
                    installedAddOn={this.getInstalledAddon(addOn)}
                    requirements={validateAddOnRequirements(addOn)}
                    onClick={this.handleCardClick(addOn)}
                    activeCard={activeCard?.id}
                  />
                ))}
              </Gallery>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
        <AddOnsParametersModal clusterID={cluster.id} />
        <AddOnsDeleteModal />
      </>
    );
  }
}

AddOnsDrawer.propTypes = {
  addOnsList: PropTypes.array.isRequired,
  clusterAddOns: PropTypes.object.isRequired,
  cluster: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  quota: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  addClusterAddOn: PropTypes.func.isRequired,
  addClusterAddOnResponse: PropTypes.object.isRequired,
  deleteClusterAddOnResponse: PropTypes.object.isRequired,
  submitClusterAddOnResponse: PropTypes.object.isRequired,
  drawer: PropTypes.object.isRequired,
  setAddonsDrawer: PropTypes.func.isRequired,
  updateClusterAddOn: PropTypes.func.isRequired,
};

export default AddOnsDrawer;
