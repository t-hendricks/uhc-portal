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

import { getInstalled, hasQuota, validateAddOnRequirements } from '../AddOnsHelper';

import AddOnsCard from '../AddOnsCard';
import AddOnStateLabel from '../AddOnStateLabel';
import AddOnsParametersModal from '../AddOnsParametersModal';
import AddOnsDeleteModal from '../AddOnsDeleteModal';
import AddOnsParameterList from './AddOnsDrawerParameterList';
import AddOnsPrimaryButton from './AddOnsDrawerPrimaryButton';
import AddOnsMetaDataItem from './AddOnsDrawerMetadataItem';
import AddOnsRequirementContent from './AddOnsDrawerRequirementContent';
import AddOnsFailedBox from './AddOnsDrawerFailedBox';

class AddOnsDrawer extends React.Component {
  state = {
    // handle open drawer
    isDrawerExpanded: false,

    // active card states mapping addon to card components
    activeCard: null,

    // active card addon requirment state
    activeCardRequirementsFulfilled: true,
    activeCardRequirements: null,

    // current active card if installed state
    installedAddOn: null,

    // active card tabs
    activeTabKey: 0,
  };

  componentDidUpdate(prevProps) {
    const { addClusterAddOnResponse, deleteClusterAddOnResponse, submitClusterAddOnResponse } =
      this.props;

    const { isDrawerExpanded } = this.state;

    if (
      (addClusterAddOnResponse.fulfilled && prevProps.addClusterAddOnResponse.pending) ||
      (deleteClusterAddOnResponse.fulfilled && prevProps.deleteClusterAddOnResponse.pending) ||
      (submitClusterAddOnResponse.fulfilled && prevProps.submitClusterAddOnResponse.pending)
    ) {
      // close drawer when cluster is added, updated or deleted
      if (isDrawerExpanded) {
        // disabling lint for setting state in component did update as is safe due to conditional
        // https://reactjs.org/docs/react-component.html#componentdidupdate
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isDrawerExpanded: false,
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
    this.setState({
      activeTabKey: tabIndex,
    });
    event.preventDefault();
  };

  // handles card click, setting active card state
  handleCardClick = (addOn) => () => {
    const { clusterAddOns } = this.props;

    const { activeCard } = this.state;

    // if acvtiveCard is clicked again close drawer
    if (addOn.id === activeCard?.id) {
      this.handleCloseDrawer();
      return;
    }

    // get installedAddon
    const installedAddOn = getInstalled(addOn, clusterAddOns);

    // get addOn requirements
    const requirements = validateAddOnRequirements(addOn);

    this.setState({
      // set active card states
      activeCard: addOn,

      // set requirments state
      activeCardRequirementsFulfilled: requirements.fulfilled,
      activeCardRequirements: requirements.errorMsgs,

      // set installed addon
      installedAddOn,

      // set drawer state
      isDrawerExpanded: true,
      activeTabKey: 0,
    });
  };

  // handle close drawer, reset state back to null
  handleCloseDrawer = () => {
    this.setState({
      activeCard: null,

      activeCardRequirements: null,
      activeCardRequirementsFulfilled: true,

      isDrawerExpanded: false,
      activeTabKey: 0,
    });
  };

  render() {
    const { addClusterAddOn, addClusterAddOnResponse, addOnsList, cluster, openModal } = this.props;

    const {
      // current selected addon info
      activeCard,

      // current selected installed addon info
      installedAddOn,

      // current selected addon requirements
      activeCardRequirements,
      activeCardRequirementsFulfilled,

      // current drawer state
      activeTabKey,
      isDrawerExpanded,
    } = this.state;

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
                </Flex>
              </DrawerPanelBody>
              <DrawerPanelBody>
                <AddOnsPrimaryButton
                  activeCard={activeCard}
                  activeCardRequirementsFulfilled={activeCardRequirementsFulfilled}
                  addClusterAddOn={addClusterAddOn}
                  addClusterAddOnResponse={addClusterAddOnResponse}
                  cluster={cluster}
                  hasQuota={this.getHasQuota(activeCard)}
                  installedAddOn={installedAddOn}
                  installedAddOnOperatorVersion={installedAddOn?.operator_version}
                  openModal={openModal}
                />
              </DrawerPanelBody>
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
          isExpanded={isDrawerExpanded}
          isInline
          className="ocm-addons-tab--addon-drawer pf-m-inline-on-2xl"
        >
          <DrawerContent
            panelContent={panelContent}
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
};

export default AddOnsDrawer;
