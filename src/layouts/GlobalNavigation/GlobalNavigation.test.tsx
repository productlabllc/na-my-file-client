import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalNavigation from './GlobalNavigation';

describe('GlobalNavigation', () => {
  it('has text official nyc text', () => {
    render(<GlobalNavigation />);

    expect(screen.getByTestId('official-nyc-text')).toHaveTextContent('Official website of the City of New York');
  });

  //   it('contains component <NYCLogo/>', () => {
  //     const { queryByTestId } = render(<GlobalNavigation />)
  //     const parentDiv = queryByTestId('parent')
  //     console.log(parentDiv)
  //     console.log('Here', within(parentDiv).queryByTestId('nyc-logo-component'))
  //     within(parentDiv).queryByTestId('nyc-logo-component')
  //   })
});
