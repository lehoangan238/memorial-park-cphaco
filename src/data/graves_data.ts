import type { Grave } from '@/types'

// Hoa Viên Nghĩa Trang Bình Dương - Mock Grave Data
// Center: [106.6521, 11.1836]

export const graves: Grave[] = [
  // Khu A - Premium Section (Northwest area)
  {
    id: 'A-001',
    name: 'Nguyễn Văn An',
    coordinates: [11.1842, 106.6505],
    area: 'Khu A',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1945-03-15',
      deathDate: '2020-08-22',
      epitaph: 'Người cha yêu thương, người chồng tận tụy',
      flowers: 24,
      visitors: 156,
      lastVisited: '2026-01-15'
    }
  },
  {
    id: 'A-002',
    name: 'Trần Thị Bích',
    coordinates: [11.1844, 106.6508],
    area: 'Khu A',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1950-07-20',
      deathDate: '2022-12-10',
      epitaph: 'Mãi yêu thương trong tim con cháu',
      flowers: 18,
      visitors: 89,
      lastVisited: '2026-01-14'
    }
  },
  {
    id: 'A-003',
    name: 'Lê Hoàng Minh',
    coordinates: [11.1840, 106.6512],
    area: 'Khu A',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1938-11-05',
      deathDate: '2019-04-18',
      epitaph: 'Một đời cống hiến cho quê hương',
      flowers: 42,
      visitors: 234,
      lastVisited: '2026-01-12'
    }
  },
  {
    id: 'A-004',
    name: null,
    coordinates: [11.1846, 106.6510],
    area: 'Khu A',
    status: 'available',
    imageUrl: null,
    price: 150000000
  },
  {
    id: 'A-005',
    name: null,
    coordinates: [11.1843, 106.6515],
    area: 'Khu A',
    status: 'reserved',
    imageUrl: null,
    reservedBy: 'Gia đình Phạm',
    reservedUntil: '2026-06-30'
  },

  // Khu B - Standard Section (Northeast area)
  {
    id: 'B-001',
    name: 'Phạm Văn Đức',
    coordinates: [11.1848, 106.6525],
    area: 'Khu B',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1952-09-12',
      deathDate: '2021-06-30',
      epitaph: 'Người thầy đáng kính',
      flowers: 15,
      visitors: 67,
      lastVisited: '2026-01-10'
    }
  },
  {
    id: 'B-002',
    name: 'Võ Thị Hương',
    coordinates: [11.1850, 106.6528],
    area: 'Khu B',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1960-02-28',
      deathDate: '2023-09-05',
      epitaph: 'Mẹ hiền yêu dấu',
      flowers: 31,
      visitors: 112,
      lastVisited: '2026-01-16'
    }
  },
  {
    id: 'B-003',
    name: null,
    coordinates: [11.1846, 106.6530],
    area: 'Khu B',
    status: 'available',
    imageUrl: null,
    price: 80000000
  },
  {
    id: 'B-004',
    name: null,
    coordinates: [11.1852, 106.6532],
    area: 'Khu B',
    status: 'available',
    imageUrl: null,
    price: 80000000
  },
  {
    id: 'B-005',
    name: 'Hoàng Văn Tâm',
    coordinates: [11.1848, 106.6535],
    area: 'Khu B',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1942-05-18',
      deathDate: '2018-11-25',
      epitaph: 'Vĩnh biệt người anh hùng',
      flowers: 56,
      visitors: 289,
      lastVisited: '2026-01-11'
    }
  },

  // Khu C - Garden Section (Southwest area)
  {
    id: 'C-001',
    name: 'Đặng Minh Tuấn',
    coordinates: [11.1828, 106.6508],
    area: 'Khu C',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1955-12-01',
      deathDate: '2024-02-14',
      epitaph: 'Nghệ sĩ của lòng người',
      flowers: 8,
      visitors: 45,
      lastVisited: '2026-01-13'
    }
  },
  {
    id: 'C-002',
    name: null,
    coordinates: [11.1826, 106.6512],
    area: 'Khu C',
    status: 'available',
    imageUrl: null,
    price: 120000000
  },
  {
    id: 'C-003',
    name: 'Bùi Thị Lan',
    coordinates: [11.1830, 106.6515],
    area: 'Khu C',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1948-08-22',
      deathDate: '2020-05-10',
      epitaph: 'Bà ngoại yêu thương của các cháu',
      flowers: 22,
      visitors: 98,
      lastVisited: '2026-01-08'
    }
  },
  {
    id: 'C-004',
    name: null,
    coordinates: [11.1824, 106.6518],
    area: 'Khu C',
    status: 'maintenance',
    imageUrl: null
  },
  {
    id: 'C-005',
    name: 'Ngô Thanh Hải',
    coordinates: [11.1832, 106.6520],
    area: 'Khu C',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1965-04-10',
      deathDate: '2025-01-02',
      epitaph: 'Doanh nhân tài ba, người con hiếu thảo',
      flowers: 4,
      visitors: 23,
      lastVisited: '2026-01-17'
    }
  },

  // Khu D - Lakeside Section (Southeast area)
  {
    id: 'D-001',
    name: null,
    coordinates: [11.1825, 106.6535],
    area: 'Khu D',
    status: 'available',
    imageUrl: null,
    price: 200000000
  },
  {
    id: 'D-002',
    name: 'Phan Văn Khoa',
    coordinates: [11.1827, 106.6538],
    area: 'Khu D',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1940-01-30',
      deathDate: '2017-09-15',
      epitaph: 'Người lính già không bao giờ chết',
      flowers: 78,
      visitors: 412,
      lastVisited: '2026-01-09'
    }
  },
  {
    id: 'D-003',
    name: null,
    coordinates: [11.1823, 106.6540],
    area: 'Khu D',
    status: 'reserved',
    imageUrl: null,
    reservedBy: 'Gia đình Trương',
    reservedUntil: '2026-12-31'
  },
  {
    id: 'D-004',
    name: 'Lý Thị Mai',
    coordinates: [11.1829, 106.6542],
    area: 'Khu D',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1958-06-18',
      deathDate: '2022-03-20',
      epitaph: 'Nụ cười mãi trong tim',
      flowers: 29,
      visitors: 134,
      lastVisited: '2026-01-14'
    }
  },
  {
    id: 'D-005',
    name: null,
    coordinates: [11.1821, 106.6545],
    area: 'Khu D',
    status: 'available',
    imageUrl: null,
    price: 200000000
  },

  // Khu E - VIP Section (Center area)
  {
    id: 'E-001',
    name: 'Trương Công Định',
    coordinates: [11.1836, 106.6521],
    area: 'Khu E',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1935-10-25',
      deathDate: '2015-07-04',
      epitaph: 'Người sáng lập, tấm gương sáng cho thế hệ sau',
      flowers: 156,
      visitors: 892,
      lastVisited: '2026-01-17'
    }
  },
  {
    id: 'E-002',
    name: 'Nguyễn Thị Kim',
    coordinates: [11.1838, 106.6524],
    area: 'Khu E',
    status: 'occupied',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop',
    memorial: {
      birthDate: '1940-03-08',
      deathDate: '2018-12-25',
      epitaph: 'Người mẹ vĩ đại của dân tộc',
      flowers: 89,
      visitors: 567,
      lastVisited: '2026-01-16'
    }
  },
  {
    id: 'E-003',
    name: null,
    coordinates: [11.1834, 106.6518],
    area: 'Khu E',
    status: 'reserved',
    imageUrl: null,
    reservedBy: 'Gia đình Lê',
    reservedUntil: '2027-03-15',
    price: 500000000
  }
]

// Area metadata
export const areas = [
  { id: 'Khu A', name: 'Khu A - Premium', description: 'Khu vực cao cấp với view đẹp', color: '#ca8a04' },
  { id: 'Khu B', name: 'Khu B - Standard', description: 'Khu vực tiêu chuẩn', color: '#84a98c' },
  { id: 'Khu C', name: 'Khu C - Garden', description: 'Khu vực vườn hoa', color: '#52796f' },
  { id: 'Khu D', name: 'Khu D - Lakeside', description: 'Khu vực ven hồ', color: '#0284c7' },
  { id: 'Khu E', name: 'Khu E - VIP', description: 'Khu vực VIP trung tâm', color: '#dc2626' }
]
