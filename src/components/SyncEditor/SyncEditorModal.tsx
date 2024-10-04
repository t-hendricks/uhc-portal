import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  Panel,
  PanelMain,
  PanelMainBody,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons/dist/esm/icons/download-icon';

import { ConfirmationDialog } from '~/common/modals/ConfirmationDialog';

import { SyncEditor } from './SyncEditor';
import { SyncEditorSchema } from './SyncEditorSchema';

import './SyncEditorModal.scss';

type SyncEditorModalProps = {
  isOpen: boolean;
  closeCallback: () => void;
  content: string;
  schema: string;
  submitButtonLabel: string;
  downloadFileName: string;
  onSubmit: (values: object | string) => void;
  translatorToObject?: (yaml: string) => object;
  isRequestPending?: boolean;
  isRequestFulfilled?: boolean;
  requestErrorMessage?: string;
  requestPendingMessage?: string;
  closeWarningMessage?: string;
};

const SyncEditorModal = ({
  isOpen,
  closeCallback,
  content,
  schema,
  submitButtonLabel,
  downloadFileName,
  onSubmit,
  translatorToObject,
  isRequestPending,
  isRequestFulfilled,
  requestErrorMessage,
  requestPendingMessage,
  closeWarningMessage,
}: SyncEditorModalProps) => {
  const [isContentValid] = useState(true);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(content);
  const contentHasChanged = useMemo(() => content !== editorContent, [editorContent, content]);

  const download = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([editorContent], { type: 'text' });
    element.href = URL.createObjectURL(file);
    element.download = downloadFileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }, [downloadFileName, editorContent]);

  const handleClose = useCallback(() => {
    if (!contentHasChanged) {
      closeCallback();
    } else {
      setIsConfirmationDialogOpen(true);
    }
  }, [closeCallback, contentHasChanged]);

  const handleSubmit = useCallback(
    () => onSubmit(translatorToObject ? translatorToObject(editorContent) : editorContent),
    [editorContent, onSubmit, translatorToObject],
  );

  const onEscapePress = useCallback(
    (_event: KeyboardEvent) => {
      if (!isRequestPending) {
        handleClose();
      }
    },
    [handleClose, isRequestPending],
  );

  useEffect(() => {
    if (isRequestFulfilled) {
      closeCallback();
    }
  }, [closeCallback, isRequestFulfilled]);

  return (
    <Modal
      title="Edit YAML"
      isOpen={isOpen}
      variant={ModalVariant.large}
      onClose={handleClose}
      id="sync-editor-modal"
      showClose={!isRequestPending}
      onEscapePress={onEscapePress}
      footer={
        <Flex>
          <FlexItem>
            <Button
              onClick={handleSubmit}
              className="pf-v5-u-mr-md"
              data-testid="submit-btn"
              isDisabled={isRequestPending || !isContentValid}
              isLoading={isRequestPending}
            >
              {submitButtonLabel}
            </Button>
            <Button variant="secondary" onClick={handleClose} isDisabled={isRequestPending}>
              Cancel
            </Button>
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            {closeWarningMessage ? (
              <Alert variant="warning" isInline isPlain title={closeWarningMessage} />
            ) : null}
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button variant="primary" icon={<DownloadIcon />} onClick={download}>
              Download
            </Button>
          </FlexItem>
        </Flex>
      }
    >
      <>
        <Sidebar hasBorder isPanelRight>
          <SidebarContent>
            {isRequestPending && requestPendingMessage ? (
              <Alert variant="info" title={requestPendingMessage} />
            ) : null}
            {requestErrorMessage ? <Alert variant="danger" title={requestErrorMessage} /> : null}
          </SidebarContent>
          <SidebarPanel width={{ default: 'width_25' }} variant="sticky">
            <Title headingLevel="h2" className="pf-v5-u-pl-sm">
              ROSA cluster creation
            </Title>
          </SidebarPanel>
        </Sidebar>
        <Sidebar style={{ overflow: 'auto' }} tabIndex={0} hasBorder isPanelRight>
          <SidebarContent style={{ height: '600px' }}>
            <SyncEditor
              content={editorContent}
              onChange={setEditorContent}
              downloadFileName={downloadFileName}
              isReadOnly={isRequestPending}
            />
          </SidebarContent>
          <SidebarPanel width={{ default: 'width_25' }} variant="sticky">
            <Tabs activeKey={0}>
              <Tab eventKey={0} title={<TabTitleText>Schema</TabTitleText>}>
                <Panel>
                  <PanelMain>
                    <PanelMainBody>
                      <SyncEditorSchema schema={schema} />
                    </PanelMainBody>
                  </PanelMain>
                </Panel>
              </Tab>
            </Tabs>
          </SidebarPanel>
        </Sidebar>
        <ConfirmationDialog
          title="Close editor without saving?"
          content="All changes will be lost."
          primaryActionLabel="Close"
          primaryAction={closeCallback}
          secondaryActionLabel="Cancel"
          isOpen={isConfirmationDialogOpen}
          closeCallback={() => setIsConfirmationDialogOpen(false)}
        />
      </>
    </Modal>
  );
};

export { SyncEditorModal, SyncEditorModalProps };
