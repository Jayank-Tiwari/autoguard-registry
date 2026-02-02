import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreatePage from '@/app/create/page'
import { createVehicle } from '@/actions/createVehicle'
import { useRouter } from 'next/navigation'

jest.mock('@/actions/createVehicle')
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

describe('Create Vehicle Page', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockPush,
            })
    })

    it('should render the create form', () => {
        render(<CreatePage />)

        expect(screen.getByText('Register Vehicle')).toBeInTheDocument()
        expect(screen.getByLabelText('Vehicle Number')).toBeInTheDocument()
        expect(screen.getByLabelText('Owner Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Contact Number')).toBeInTheDocument()
        expect(screen.getByText('Emergency Contacts')).toBeInTheDocument()
    })

    it('should have default emergency contact (Police - 112)', () => {
        render(<CreatePage />)

        const selects = screen.getAllByRole('combobox')
        expect(selects[0]).toHaveValue('Police')

        const inputs = screen.getAllByPlaceholderText('Phone Number')
        expect(inputs[0]).toHaveValue('112')
    })

    it('should add a new emergency contact', async () => {
        render(<CreatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')
        fireEvent.click(addButton)

        await waitFor(() => {
            const inputs = screen.getAllByPlaceholderText('Phone Number')
            expect(inputs).toHaveLength(2)
        })
    })

    it('should remove an emergency contact', async () => {
        render(<CreatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')
        fireEvent.click(addButton)

        await waitFor(() => {
            const removeButtons = screen.getAllByText('Remove')
            expect(removeButtons.length).toBeGreaterThan(0)
            fireEvent.click(removeButtons[0])
        })
    })

    it('should not allow more than 10 emergency contacts', async () => {
        render(<CreatePage />)

        const addButton = screen.getByText('+ Add Emergency Contact')

        for (let i = 0; i < 9; i++) {
            fireEvent.click(addButton)
        }

        await waitFor(() => {
            expect(screen.queryByText('+ Add Emergency Contact')).not.toBeInTheDocument()
        })
    })

    it('should submit form with valid data', async () => {
        ; (createVehicle as jest.Mock).mockResolvedValue(undefined)

        render(<CreatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const ownerInput = screen.getByLabelText('Owner Name')
        const contactInput = screen.getByLabelText('Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(ownerInput, 'John Doe')
        await userEvent.type(contactInput, '9876543210')

        const submitButton = screen.getByText('Create Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(createVehicle).toHaveBeenCalledWith({
                vehicleNumber: 'ABC123',
                ownerName: 'John Doe',
                contactNumber: '9876543210',
                emergencyContacts: [{ label: 'Police', phone: '112' }],
            })
            expect(mockPush).toHaveBeenCalledWith('/v/ABC123')
        })
    })

    it('should show error if emergency contact is invalid', async () => {
        render(<CreatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const ownerInput = screen.getByLabelText('Owner Name')
        const contactInput = screen.getByLabelText('Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(ownerInput, 'John Doe')
        await userEvent.type(contactInput, '9876543210')

        const inputs = screen.getAllByPlaceholderText('Phone Number')
        await userEvent.clear(inputs[0])

        const submitButton = screen.getByText('Create Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('At least 1 emergency contact is required')).toBeInTheDocument()
        })
    })

    it('should show error on submission failure', async () => {
        const errorMessage = 'Vehicle with this number already exists'
            ; (createVehicle as jest.Mock).mockRejectedValue(new Error(errorMessage))

        render(<CreatePage />)

        const vehicleInput = screen.getByLabelText('Vehicle Number')
        const ownerInput = screen.getByLabelText('Owner Name')
        const contactInput = screen.getByLabelText('Contact Number')

        await userEvent.type(vehicleInput, 'ABC123')
        await userEvent.type(ownerInput, 'John Doe')
        await userEvent.type(contactInput, '9876543210')

        const submitButton = screen.getByText('Create Vehicle')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })
    })
})
