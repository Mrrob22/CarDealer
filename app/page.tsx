"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VehicleMake {
    MakeId: string;
    MakeName: string;
}

const VEHICLE_MAKES_API = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json';

const generateModelYears = (): number[] => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i);
};

const FilterPage: React.FC = () => {
    const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
    const [selectedMake, setSelectedMake] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [isNextEnabled, setIsNextEnabled] = useState<boolean>(false);

    useEffect(() => {
        fetch(VEHICLE_MAKES_API)
            .then((response) => response.json())
            .then((data) => setVehicleMakes(data.Results || []))
            .catch((error) => console.error('Error fetching vehicle makes:', error));
    }, []);

    useEffect(() => {
        setIsNextEnabled(!!selectedMake && !!selectedYear);
    }, [selectedMake, selectedYear]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Car Dealer Filter</h1>

            <div className="mb-4 w-full max-w-md">
                <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Vehicle Make
                </label>
                <select
                    id="vehicle-make"
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                    <option value="">-- Select Make --</option>
                    {vehicleMakes.map((make) => (
                        <option key={make.MakeId} value={make.MakeId}>
                            {make.MakeName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6 w-full max-w-md">
                <label htmlFor="model-year" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Model Year
                </label>
                <select
                    id="model-year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                    <option value="">-- Select Year --</option>
                    {generateModelYears().map((year) => (
                        <option key={year} value={year.toString()}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <Link href={`/result/${selectedMake}/${selectedYear}`} passHref>
                <button>Next</button>
            </Link>
        </div>
    );
};

export default FilterPage;