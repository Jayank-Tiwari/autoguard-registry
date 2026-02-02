import React from 'react'
import { render, screen } from '@testing-library/react'
import VehiclePage from '@/app/v/[vehicleNumber]/page'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
    prisma: {
        vehicle: {
            findUnique: jest.fn(),
        },
    },
}))

describe('Vehicle View Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should display vehicle information when found', async () => {
        const mockVehicle = {
            id: 1,
            vehicleNumber: 'ABC123',
            ownerName: 'John Doe',
            contactNumber: '9876543210',
            isDisabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            emergencyContacts: [
                { id: 1, label: 'Police', phone: '112', vehicleId: 1 },
                { id: 2, label: 'Ambulance', phone: '101', vehicleId: 1 },
            ],
        }

            ; (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle)

        const page = await VehiclePage({
            params: Promise.resolve({ vehicleNumber: 'ABC123' }),
        })

        render(page)

        expect(screen.getByText('Vehicle Information')).toBeInTheDocument()
        expect(screen.getByText('ABC123')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('9876543210')).toBeInTheDocument()
        expect(screen.getByText('Police')).toBeInTheDocument()
        expect(screen.getByText('112')).toBeInTheDocument()
        expect(screen.getByText('Ambulance')).toBeInTheDocument()
        expect(screen.getByText('101')).toBeInTheDocument()
    })

    it('should show "Vehicle not available" when vehicle not found', async () => {
        ; (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null)

        const page = await VehiclePage({
            params: Promise.resolve({ vehicleNumber: 'NOTEXIST' }),
        })

        render(page)

        expect(screen.getByText('Vehicle not available')).toBeInTheDocument()
    })

    it('should show "Vehicle not available" when vehicle is disabled', async () => {
        const mockVehicle = {
            id: 1,
            vehicleNumber: 'ABC123',
            ownerName: 'John Doe',
            contactNumber: '9876543210',
            isDisabled: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            emergencyContacts: [],
        }

            ; (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle)

        const page = await VehiclePage({
            params: Promise.resolve({ vehicleNumber: 'ABC123' }),
        })

        render(page)

        expect(screen.getByText('Vehicle not available')).toBeInTheDocument()
    })

    it('should display all emergency contacts', async () => {
        const mockVehicle = {
            id: 1,
            vehicleNumber: 'ABC123',
            ownerName: 'John Doe',
            contactNumber: '9876543210',
            isDisabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            emergencyContacts: [
                { id: 1, label: 'Police', phone: '112', vehicleId: 1 },
                { id: 2, label: 'Ambulance', phone: '101', vehicleId: 1 },
                { id: 3, label: 'Fire', phone: '101', vehicleId: 1 },
                { id: 4, label: 'Friend', phone: '9999999999', vehicleId: 1 },
            ],
        }

            ; (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle)

        const page = await VehiclePage({
            params: Promise.resolve({ vehicleNumber: 'ABC123' }),
        })

        render(page)

        expect(screen.getByText('Police')).toBeInTheDocument()
        expect(screen.getByText('Ambulance')).toBeInTheDocument()
        expect(screen.getByText('Fire')).toBeInTheDocument()
        expect(screen.getByText('Friend')).toBeInTheDocument()
    })

    it('should fetch vehicle with correct vehicleNumber', async () => {
        const mockVehicle = {
            id: 1,
            vehicleNumber: 'XYZ789',
            ownerName: 'Jane Doe',
            contactNumber: '1234567890',
            isDisabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            emergencyContacts: [],
        }

            ; (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle)

        await VehiclePage({
            params: Promise.resolve({ vehicleNumber: 'XYZ789' }),
        })

        expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
            where: { vehicleNumber: 'XYZ789' },
            include: { emergencyContacts: true },
        })
    })
})
