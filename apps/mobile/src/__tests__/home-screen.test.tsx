import { REPORT_STATUS_LABELS, REPORT_STATUSES } from '@chucarit/shared';
import { render, screen } from '@testing-library/react-native';

import HomeScreen from '../app/index';

jest.mock('expo-router', () => ({
  useTheme: () => ({ colors: { text: '#000', border: '#ccc' } }),
}));

describe('HomeScreen', () => {
  it('shows every report status with its Spanish label from @chucarit/shared', async () => {
    await render(<HomeScreen />);

    expect(screen.getAllByTestId('report-status')).toHaveLength(REPORT_STATUSES.length);
    for (const status of REPORT_STATUSES) {
      expect(screen.getByText(REPORT_STATUS_LABELS[status])).toBeOnTheScreen();
    }
  });
});
