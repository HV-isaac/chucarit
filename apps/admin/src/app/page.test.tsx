import { REPORT_STATUS_LABELS, REPORT_STATUSES } from '@chucarit/shared';
import { render, screen } from '@testing-library/react';

import Home from './page';

describe('Home', () => {
  it('lists every report status with its Spanish label from @chucarit/shared', () => {
    render(<Home />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(REPORT_STATUSES.length);
    for (const status of REPORT_STATUSES) {
      expect(screen.getByText(REPORT_STATUS_LABELS[status])).toBeInTheDocument();
    }
  });
});
