import React from 'react';

interface VehicleModel {
    Model_ID: number;
    Model_Name: string;
}

const VEHICLE_MODELS_API =
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/{makeId}/modelyear/{year}?format=json';

async function fetchVehicleModels(makeId: string, year: string): Promise<VehicleModel[]> {
    try {
        const res = await fetch(
            VEHICLE_MODELS_API.replace('{makeId}', makeId).replace('{year}', year)
        );

        if (!res.ok) {
            throw new Error('Failed to fetch vehicle models');
        }

        const data = await res.json();
        return data.Results || [];
    } catch (error) {
        console.error('Error fetching vehicle models:', error);
        return [];
    }
}

export default async function Page({ params }: { params: { makeId: string; year: string } }) {
    const { makeId, year } = params;

    const vehicles = await fetchVehicleModels(makeId, year);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">
                Vehicle Models for Make {makeId} - Year {year}
            </h1>
            <ul className="w-full max-w-2xl">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <li key={vehicle.Model_ID} className="p-4 border-b border-gray-200">
                            {vehicle.Model_Name}
                        </li>
                    ))
                ) : (
                    <p>No vehicle models found for this selection.</p>
                )}
            </ul>
        </div>
    );
}
