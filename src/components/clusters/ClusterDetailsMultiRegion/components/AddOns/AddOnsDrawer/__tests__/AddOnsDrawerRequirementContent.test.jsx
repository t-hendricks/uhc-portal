import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AddOnsRequirementContent from '../AddOnsDrawerRequirementContent';

describe('<AddOnsRequirementContent />', () => {
  const props = { activeCardRequirements: ['first requirement', 'second requirement'] };

  it('is accessible', async () => {
    const { container } = render(<AddOnsRequirementContent {...props} />);
    await checkAccessibility(container);
  });

  it('expect to render all requirements', () => {
    render(<AddOnsRequirementContent {...props} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    props.activeCardRequirements.forEach((requirement, index) => {
      expect(listItems[index]).toHaveTextContent(requirement);
    });
  });

  it('expect to not render and ListItems if not requirements are passed', () => {
    const newProps = { ...props, activeCardRequirements: null };
    render(<AddOnsRequirementContent {...newProps} />);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});
