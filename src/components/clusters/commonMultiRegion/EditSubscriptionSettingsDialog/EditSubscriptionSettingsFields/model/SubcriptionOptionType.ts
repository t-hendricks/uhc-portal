import { subscriptionSettings } from '~/common/subscriptionTypes';

type SubcriptionOptionType = (typeof subscriptionSettings)[keyof typeof subscriptionSettings];

export { SubcriptionOptionType };
