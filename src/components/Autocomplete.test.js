import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutoComplete from './AutoComplete';

describe('AutoComplete', () => {
    const user = userEvent.setup();
    const basicProps = {
        onFetchRequested: jest.fn(),
        suggestions: [],
    };

    test('renders input element with correct props', () => {
        render(<AutoComplete {...basicProps} inputProps={{ placeholder: 'Search' }} />);
        const input = screen.getByRole('textbox');
        
        expect(input).toHaveAttribute('autocomplete', 'off');
        expect(input).toHaveAttribute('placeholder', 'Search');
        expect(input).toHaveClass('autocompleteInput');
    });

    test('triggers search on input change', async () => {
        const onFetchRequested = jest.fn();
        render(<AutoComplete {...basicProps} onFetchRequested={onFetchRequested} />);
        const input = screen.getByRole('textbox');

        await user.type(input, 'react');
        await waitFor(() => {
            expect(onFetchRequested).toHaveBeenCalledWith('react');
        });
    });

    test('displays suggestions when provided', () => {
        const suggestions = [{ id: '1', text: 'Apple' }];
        const renderSuggestions = (suggestions) => 
          suggestions.map(s => <div key={s.id}>{s.text}</div>);
      
        const { container } = render(
          <AutoComplete
            {...basicProps}
            suggestions={suggestions}
            renderSuggestions={renderSuggestions}
          />
        );
      
        // Verify list items instead of direct text
        const listItems = container.querySelectorAll('li[role="option"]');
        expect(listItems).toHaveLength(1);
        expect(listItems[0].textContent).toBe('Apple');
      });
    test('handles keyboard navigation', async () => {
        const suggestions = [
            { id: '1', text: 'Apple' },
            { id: '2', text: 'Banana' },
        ];
        const renderSuggestions = (suggestions, { highlightIndex }) =>
            suggestions.map((s, index) => (
                <div 
                    key={s.id} 
                    role="option" 
                    aria-selected={index === highlightIndex}
                    data-testid={`option-${index}`}
                >
                    {s.text}
                </div>
            ));

        render(
            <AutoComplete
                {...basicProps}
                suggestions={suggestions}
                renderSuggestions={renderSuggestions}
            />
        );

        const input = screen.getByRole('textbox');
        await user.click(input);
        
        // Navigate using keyboard
        await user.keyboard('[ArrowDown]');
        expect(screen.getByTestId('option-0')).toHaveAttribute('aria-selected', 'true');
        
        await user.keyboard('[ArrowDown]');
        expect(screen.getByTestId('option-1')).toHaveAttribute('aria-selected', 'true');
        
        await user.keyboard('[ArrowUp]');
        expect(screen.getByTestId('option-0')).toHaveAttribute('aria-selected', 'true');
    });

    test('triggers selection on suggestion click', async () => {
        const onSuggestionSelected = jest.fn();
        const suggestions = [{ id: '1', text: 'Apple' }];
        
        const renderSuggestions = (suggestions) =>
          suggestions.map(s => <div key={s.id}>{s.text}</div>);
      
        render(
          <AutoComplete
            {...basicProps}
            suggestions={suggestions}
            renderSuggestions={renderSuggestions}
            onSuggestionSelected={onSuggestionSelected}
          />
        );
      
        await userEvent.click(screen.getByText('Apple'));
      
        await waitFor(() => {
          expect(onSuggestionSelected).toHaveBeenCalledWith(
            expect.objectContaining({
              id: '1',
              text: 'Apple'
            })
          );
        });
      });


    test('uses custom suggestions container', async () => {
        const renderContainer = (children) => (
            <div data-testid="custom-container">{children}</div>
        );
        const suggestions = [{ id: '1', text: 'Apple' }];
        const renderSuggestions = () => [<div key="1" role="option">Apple</div>];

        render(
            <AutoComplete
                {...basicProps}
                suggestions={suggestions}
                renderSuggestions={renderSuggestions}
                renderSuggestionsContainer={renderContainer}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('custom-container')).toBeInTheDocument();
        });
    });

    test('has proper accessibility attributes', async () => {
        const suggestions = [{ id: '1', text: 'Apple' }];
        const renderSuggestions = () => [<div key="1">Apple</div>];

        render(
            <AutoComplete
                {...basicProps}
                suggestions={suggestions}
                renderSuggestions={renderSuggestions}
            />
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
            expect(screen.getByRole('listbox')).toBeInTheDocument();
            expect(screen.getByRole('option')).toBeInTheDocument();
        });
    });

    test('doesnt render suggestions when empty', async () => {
        const { rerender } = render(<AutoComplete {...basicProps} />);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

        rerender(<AutoComplete {...basicProps} suggestions={[]} />);
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });
    });
});
