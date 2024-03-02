import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GlobalLanguageSelector from './GlobalLanguageSelector';

describe('Native select wrapper', () => {
  it('has language selector in document', () => {
    render(<GlobalLanguageSelector />);

    expect(screen.getByTestId('select-language')).toBeInTheDocument();
  });

  it('select has english language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/english/i))
    );
    expect(await screen.findByText(/english/i)).toBeInTheDocument();
  });

  it('select has spanish language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Español/i))
    );
    expect(await screen.findByText(/Español/i)).toBeInTheDocument();
  });

  it('select has french language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Français/i))
    );
    expect(await screen.findByText(/Français/i)).toBeInTheDocument();
  });

  it('select has chinese language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() => userEvent.click(within(optionsPopup).getByText(/中文/i)));
    expect(await screen.findByText(/中文/i)).toBeInTheDocument();
  });

  it('select has arabic language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() => userEvent.click(within(optionsPopup).getByText(/عرب/i)));
    expect(await screen.findByText(/عرب/i)).toBeInTheDocument();
  });

  it('select has russian language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Русский/i))
    );
    expect(await screen.findByText(/Русский/i)).toBeInTheDocument();
  });

  it('select has urdu language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() => userEvent.click(within(optionsPopup).getByText(/اردو/i)));
    expect(await screen.findByText(/اردو/i)).toBeInTheDocument();
  });

  it('select has korean language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() => userEvent.click(within(optionsPopup).getByText(/한국인/i)));
    expect(await screen.findByText(/한국인/i)).toBeInTheDocument();
  });

  it('select has kreyol ayisyen language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Kreyol Ayisyen/i))
    );
    expect(await screen.findByText(/Kreyol Ayisyen/i)).toBeInTheDocument();
  });

  it('select has bengali language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() => userEvent.click(within(optionsPopup).getByText(/বাংলা/i)));
    expect(await screen.findByText(/বাংলা/i)).toBeInTheDocument();
  });

  it('select has polish language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Polskie/i))
    );
    expect(await screen.findByText(/Polskie/i)).toBeInTheDocument();
  });

  it('select has ukrainian language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Українська/i))
    );
    expect(await screen.findByText(/Українська/i)).toBeInTheDocument();
  });

  it('select has portuguese language', async () => {
    render(<GlobalLanguageSelector />);
    const selectItem = await screen.findByText(/english/i);
    expect(selectItem).toBeInTheDocument();

    userEvent.click(selectItem);
    const optionsPopup = await screen.findByRole('listbox');

    await act(() =>
      userEvent.click(within(optionsPopup).getByText(/Português/i))
    );
    expect(await screen.findByText(/Português/i)).toBeInTheDocument();
  });

  it('has translate icon', async () => {
    render(<GlobalLanguageSelector />);
    const span = screen.getByTestId('language-icon');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent(/translate/i);
  });
});
