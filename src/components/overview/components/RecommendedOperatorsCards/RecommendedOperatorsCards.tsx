import React, { ReactNode } from 'react';
import { Button, Flex, FlexItem, Title } from '@patternfly/react-core';

import RedHatOpenShiftGitOpsIcon from '../../../../styles/images/RedHatOpenShiftGitOpsIcon.svg';
import RedHatOpenShiftPipelinesIcon from '../../../../styles/images/RedHatOpenShiftPipelinesIcon.svg';
import RedHatOpenShiftServiceMeshIcon from '../../../../styles/images/RedHatOpenShiftServiceMeshIcon.svg';

import ProductCard from '../ProductCard/ProductCard';
import './RecommendedOperatorsCards.scss';

type RecommendedOperatorsCardsNode = {
  title: string;
  description: string;
  icon: string | undefined;
  labelText?: string;
  // todo: Insert this drawer content, I think I should put it as JSX
  // https://docs.google.com/document/d/12P26OSlRgxZC1sK2BFS30-RTdugp3nfFW39lRu92byc/edit
  drawerPanelContent?: ReactNode;
};

const RECOMMENDED_OPERATORS_CARDS: RecommendedOperatorsCardsNode[] = [
  {
    title: 'Red Hat OpenShift GitOps',
    description:
      'Integrate git repositories, continuous integration/continuous delivery (CI/CD) tools, and Kubernetes.',
    icon: RedHatOpenShiftGitOpsIcon,
    labelText: 'Free',
    // todo: Insert this drawer content, I think I should put it as JSX
    // https://docs.google.com/document/d/12P26OSlRgxZC1sK2BFS30-RTdugp3nfFW39lRu92byc/edit
    drawerPanelContent: <Button className="drawerPanelContent-GitOps">GitOps</Button>,
  },
  {
    title: 'Red Hat OpenShift Pipelines',
    description:
      'Automate your application delivery using a continuous integration and continuous deployment (CI/CD) framework.',
    icon: RedHatOpenShiftPipelinesIcon,
    labelText: 'Free',
    // todo: Insert this drawer content, I think I should put it as JSX
    // https://docs.google.com/document/d/1g0UyIt3Yjn36UC4qoRoE351u76o9p1zDRbma7rChUOk/edit
    drawerPanelContent: <Button className="drawerPanelContent-Pipelines">Pipelines</Button>,
  },
  {
    title: 'Red Hat OpenShift Service Mesh',
    description: 'Connect, manage, and observe microservices-based applications in a uniform way.',
    icon: RedHatOpenShiftServiceMeshIcon,
    labelText: 'Free',
    // todo: Insert this drawer content, I think I should put it as JSX
    // https://docs.google.com/document/d/1RZRvRPwjcwb3VxhC5lYVOp4rJeMBEOC64i_f9vUbMTA/edit
    drawerPanelContent: <Button className="drawerPanelContent-Service Mesh">Service Mesh</Button>,
  },
  // todo: do we need this card? -> it was added and then removed from the mock
  // {
  //   title: 'OperatorHub',
  //   description: 'Discover and install Kubernetes operators quickly and easily.',
  //   icon: RedHatOperatorHubIcon,
  //   // todo: Insert this drawer content, I think I should put it as JSX
  //   // https://docs.google.com/document/d/1byWr5Z1TxM0l0SeZsBQpPMkAyfhk8K_bLidFwkMKvb8/edit
  //   drawerPanelContent: <Button className="drawerPanelContent-OperatorHub">OperatorHub</Button>,
  // },
];

type RecommendedOperatorsCardsProps = {
  openReadMore: (title: string, content: ReactNode) => void;
};

const RecommendedOperatorsCards = ({ openReadMore }: RecommendedOperatorsCardsProps) => (
  <>
    <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
      Recommended operators
    </Title>
    <Flex className="pf-v5-u-mb-lg">
      {RECOMMENDED_OPERATORS_CARDS.map((card) => (
        <FlexItem className="pf-v5-u-pt-md" data-testid={`product-overview-card-flex-item`}>
          <ProductCard {...card} openReadMore={openReadMore} />
          {/* <Card className="product-overview-card">
							<CardHeader>
								<Split hasGutter style={{ width: '100%' }}>
									<SplitItem>
										<img src={icon} alt={`${title} icon`} className="product-overview-card__icon" />
									</SplitItem>
									<SplitItem isFilled />
									<SplitItem>
										{labelText ? (
											<Label data-testtag="label" color="blue">
												{labelText}
											</Label>
										) : null}
									</SplitItem>
								</Split>
							</CardHeader>
							<CardTitle>
								{/* todo: check card's title size and positioning 
								<Title headingLevel="h3">{title}</Title>
							</CardTitle>
							<CardBody>{description}</CardBody>
							<CardFooter>
								{/* todo: think about the icon size 
								<Button
									className="read-more-button"
									onClick={() => openReadMore(title, drawerPanelContent)}
									variant="link"
									icon={<OpenDrawerRightIcon />}
									iconPosition="end"
								>
									Read more
								</Button>
							</CardFooter>
						</Card> */}
        </FlexItem>
      ))}
    </Flex>
  </>
);

export default RecommendedOperatorsCards;
