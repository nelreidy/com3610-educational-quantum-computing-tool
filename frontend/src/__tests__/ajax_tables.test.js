import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import { fetchCircuits } from '../ajax_tables.mjs';

jest.mock('flowbite', () => ({
    initFlowbite: jest.fn()
}));

describe('ajax_tables module', () => {
    beforeEach(() => {
        fetch.resetMocks();
        document.body.innerHTML = `<div id="circuit-table"></div>`;
    });

    describe('DOMContentLoaded behavior', () => {
        it('should fetch circuits if #circuit-table exists when DOMContentLoaded fires', () => {
            const mockHtml = '<div>New Table Content</div>';
            fetch.mockResponseOnce(mockHtml);
            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(fetch).toHaveBeenCalledWith('/circuit_table/?page=1', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
        });

        it('should not fetch circuits if #circuit-table does not exist', () => {
            document.body.innerHTML = ''; // Remove the element
            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(fetch).not.toHaveBeenCalled();
        });
    });

    describe('fetchCircuits function', () => {
        it('should update the circuit table on successful fetch', async () => {
            const mockHtml = '<div>New Content</div>';
            fetch.mockResponseOnce(mockHtml);
            await fetchCircuits(1);

            await new Promise(process.nextTick);

            expect(document.getElementById('circuit-table').innerHTML).toBe(mockHtml);
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('should handle fetch error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            fetch.mockReject(new Error('Network error'));

            await fetchCircuits(1);
            await new Promise(process.nextTick);

            expect(console.error).toHaveBeenCalledWith('Error loading the circuits:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('pagination interaction', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="circuit-table"></div>
                <div id="pagination">
                    <a href="?page=2">2</a>
                    <a href="?page=3">3</a>
                </div>
            `;
        });
    
        it('should prevent default behavior on pagination link click', () => {
            // TODO: not correct does not do test desc
            const preventDefaultSpy = jest.fn();
            const link = document.querySelector('#pagination a');

            document.dispatchEvent(new Event('DOMContentLoaded'));
    
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                preventDefault: preventDefaultSpy
            });

            link.dispatchEvent(event);
    
            expect(fetch).toHaveBeenCalledTimes(1)            
        });
    });
});
