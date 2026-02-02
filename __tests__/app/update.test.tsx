import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UpdatePage from '@/app/update/page'
import { updateVehicle } from '@/actions/updateVehicle'

jest.mock('@/actions/updateVehicle')

describe('Update Vehicle Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render the update form', () => {
        render(<UpdatePage />)

        expect(screen.getByText('Update Vehicle')).toBeInTheDocument()
        expect(screen.getByLabelText('Vehicle Number')).toBeInTheDocument()
        expect(screen.getByLabelText('Current Contact Number (for verification)')).toBeInTheDocument()
        expect(screen.getByLabelText('Owner Name')).toBeInTheDocument()
        expect(screen.getByLabelText('New Contact Number')).toBeInTheDocument()
        expect(screen.getByText('Emergency Contacts')).toBeInTheDocument()
    })

    it('should have default emergency contact (Police - 112)', () => {
        render(<UpdatePage />)

        const selects = screen.getAllByRole('combobox')
        expect(selects[0]).toHaveValue('Police')

        const inputs = screen.getAllByPlaceholderText('Phone Number')
        expect(inputs[0]).toHaveValue('112')
    })

    it('should add a new emergency contact', async () => {
        render(<UpdatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')
        fireEvent.click(addButton)

        await waitFor(() => {
            const inputs = screen.getAllByPlaceholderText('Phone Number')
            expect(inputs).toHaveLength(2)
        })
    })

    it('should remove an emergency contact', async () => {
        render(<UpdatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')
        fireEvent.click(addButton)

        await waitFor(() => {
            const removeButtons = screen.getAllByText('Remove')
            expect(removeButtons.length).toBeGreaterThan(0)
            fireEvent.click(removeButtons[0])
        })
    })

    it('should not allow more than 10 emergency contacts', async () => {
        render(<UpdatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')

        for (let i = 0; i < 9; i++) {
            fireEvent.click(addButton)
        }

        await waitFor(() => {
            expect(screen.queryByText('+ Add Emergency Contact')).not.toBeInTheDocument()
        })
    })

    it('should submit form with valid data', async () => {
        ; (updateVehicle as jest.Mock).mockResolvedValue(undefined)

        render(<UpdatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const contactInput = screen.getByLabelText('Current Contact Number (for verification)')
        const ownerInput = screen.getByLabelText('Owner Name')
        const newContactInput = screen.getByLabelText('New Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(contactInput, '9876543210')
        await userEvent.type(ownerInput, 'Jane Doe')
        await userEvent.type(newContactInput, '9999999999')

        const submitButton = screen.getByText('Update Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(updateVehicle).toHaveBeenCalledWith({
                vehicleNumber: 'ABC123',
                contactNumber: '9876543210',
                ownerName: 'Jane Doe',
                newContactNumber: '9999999999',
                emergencyContacts: [{ label: 'Police', phone: '112' }],
            })
            expect(screen.getByText('Vehicle updated successfully')).toBeInTheDocument()
        })
    })

    it('should show error if emergency contact is invalid', async () => {
        render(<UpdatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const contactInput = screen.getByLabelText('Current Contact Number (for verification)')
        const ownerInput = screen.getByLabelText('Owner Name')
        const newContactInput = screen.getByLabelText('New Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(contactInput, '9876543210')
        await userEvent.type(ownerInput, 'Jane Doe')
        await userEvent.type(newContactInput, '9999999999')

        const inputs = screen.getAllByPlaceholderText('Phone Number')
        await userEvent.clear(inputs[0])

        const submitButton = screen.getByText('Update Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('At least 1 emergency contact is required')).toBeInTheDocument()
        })
    })

    it('should show error on submission failure', async () => {
        const errorMessage = 'Vehicle not found or contact number does not match'
            ; (updateVehicle as jest.Mock).mockRejectedValue(new Error(errorMessage))

        render(<UpdatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const contactInput = screen.getByLabelText('Current Contact Number (for verification)')
        const ownerInput = screen.getByLabelText('Owner Name')
        const newContactInput = screen.getByLabelText('New Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(contactInput, '9876543210')
        await userEvent.type(ownerInput, 'Jane Doe')
        await userEvent.type(newContactInput, '9999999999')

        const submitButton = screen.getByText('Update Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })
    })

    it('should clear success message when new error occurs', async () => {
        ; (updateVehicle as jest.Mock)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('Update failed'))

        render(<UpdatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const contactInput = screen.getByLabelText('Current Contact Number (for verification)')
        const ownerInput = screen.getByLabelText('Owner Name')
        const newContactInput = screen.getByLabelText('New Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(contactInput, '9876543210')
        await userEvent.type(ownerInput, 'Jane Doe')
        await userEvent.type(newContactInput, '9999999999')

        const submitButton = screen.getByText('Update Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Vehicle updated successfully')).toBeInTheDocument()
        })

        await userEvent.clear(vehicleInput)
        await userEvent.type(vehicleInput, 'XYZ789')

        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.queryByText('Vehicle updated successfully')).not.toBeInTheDocument()
            expect(screen.getByText('Update failed')).toBeInTheDocument()
        })
    })
})
