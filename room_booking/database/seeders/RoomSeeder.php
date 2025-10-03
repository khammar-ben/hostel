<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => 'R001',
                'name' => '4-Bed Mixed Dorm A',
                'type' => 'Mixed Dormitory',
                'capacity' => 4,
                'occupied' => 3,
                'floor' => 1,
                'price' => 25.00,
                'status' => 'available',
                'description' => 'Comfortable mixed dormitory with individual lockers and reading lights.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Reading Lights', 'Power Outlets'],
                'last_cleaned' => now()->subHours(2),
            ],
            [
                'room_number' => 'R002',
                'name' => '6-Bed Female Dorm B',
                'type' => 'Female Dormitory',
                'capacity' => 6,
                'occupied' => 6,
                'floor' => 1,
                'price' => 23.00,
                'status' => 'full',
                'description' => 'Female-only dormitory with shared bathroom facilities.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Hair Dryer', 'Shared Bathroom'],
                'last_cleaned' => now()->subHours(1),
            ],
            [
                'room_number' => 'R003',
                'name' => 'Private Single 201',
                'type' => 'Private Single',
                'capacity' => 1,
                'occupied' => 1,
                'floor' => 2,
                'price' => 45.00,
                'status' => 'occupied',
                'description' => 'Private single room with shared bathroom facilities.',
                'amenities' => ['Private Space', 'Shared Bathroom', 'Free WiFi', 'Quiet Area', 'Reading Desk'],
                'last_cleaned' => now()->subDays(1),
            ],
            [
                'room_number' => 'R004',
                'name' => 'Private Double 302',
                'type' => 'Private Double',
                'capacity' => 2,
                'occupied' => 0,
                'floor' => 3,
                'price' => 65.00,
                'status' => 'maintenance',
                'description' => 'Private double room with private bathroom and city view.',
                'amenities' => ['Private Bathroom', 'Free WiFi', 'TV', 'City View', 'Mini Fridge'],
                'last_cleaned' => now()->subDays(2),
            ],
            [
                'room_number' => 'R005',
                'name' => '8-Bed Mixed Dorm C',
                'type' => 'Mixed Dormitory',
                'capacity' => 8,
                'occupied' => 5,
                'floor' => 2,
                'price' => 20.00,
                'status' => 'available',
                'description' => 'Budget-friendly mixed dormitory with large windows.',
                'amenities' => ['Free WiFi', 'AC', 'Individual Lockers', 'Large Windows', 'Common Area Access'],
                'last_cleaned' => now()->subHours(3),
            ],
            [
                'room_number' => 'R006',
                'name' => '12-Bed Mixed Dorm D',
                'type' => 'Mixed Dormitory',
                'capacity' => 12,
                'occupied' => 8,
                'floor' => 3,
                'price' => 18.00,
                'status' => 'available',
                'description' => 'Economy option with basic amenities and large windows.',
                'amenities' => ['Free WiFi', 'Individual Lockers', 'Large Windows', 'Reading Lights'],
                'last_cleaned' => now()->subHours(4),
            ],
        ];

        foreach ($rooms as $roomData) {
            Room::create($roomData);
        }
    }
}
