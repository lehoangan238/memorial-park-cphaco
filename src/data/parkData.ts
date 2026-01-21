import type { Plot, Section, ParkStats, Memorial } from '@/types'

// Section definitions with SVG paths for the park layout
export const sections: Section[] = [
  {
    id: 'garden-of-peace',
    name: 'Garden of Peace',
    description: 'A serene garden area with beautiful landscaping',
    totalPlots: 48,
    availablePlots: 12,
    color: '#84a98c',
    paths: 'M100,80 L300,80 L300,200 L100,200 Z',
  },
  {
    id: 'eternal-rest',
    name: 'Eternal Rest',
    description: 'Traditional memorial grounds with mature trees',
    totalPlots: 64,
    availablePlots: 8,
    color: '#78716c',
    paths: 'M320,80 L520,80 L520,200 L320,200 Z',
  },
  {
    id: 'sunrise-meadow',
    name: 'Sunrise Meadow',
    description: 'Open meadow area facing the morning sun',
    totalPlots: 36,
    availablePlots: 18,
    color: '#ca8a04',
    paths: 'M100,220 L300,220 L300,340 L100,340 Z',
  },
  {
    id: 'reflection-pond',
    name: 'Reflection Pond',
    description: 'Peaceful area surrounding the memorial pond',
    totalPlots: 24,
    availablePlots: 6,
    color: '#0284c7',
    paths: 'M320,220 L520,220 L520,340 L320,340 Z',
  },
  {
    id: 'heritage-grove',
    name: 'Heritage Grove',
    description: 'Historic section with ancient oak trees',
    totalPlots: 40,
    availablePlots: 4,
    color: '#52796f',
    paths: 'M540,80 L700,80 L700,340 L540,340 Z',
  },
]

// Generate plots for each section
function generatePlots(): Plot[] {
  const plots: Plot[] = []
  const plotSize = 18
  const gap = 4

  sections.forEach((section) => {
    // Parse section path to get bounds
    const pathMatch = section.paths.match(/M(\d+),(\d+) L(\d+),(\d+)/)
    if (!pathMatch) return

    const startX = parseInt(pathMatch[1]) + 10
    const startY = parseInt(pathMatch[2]) + 10
    const endX = parseInt(pathMatch[3]) - 10
    const endY = parseInt(pathMatch[4]) - 10

    const cols = Math.floor((endX - startX) / (plotSize + gap))
    const rows = Math.floor((endY - startY) / (plotSize + gap))

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const plotId = `${section.id}-${row + 1}-${col + 1}`
        const random = Math.random()
        let status: Plot['status'] = 'available'
        
        if (random < 0.5) status = 'occupied'
        else if (random < 0.7) status = 'reserved'
        else if (random < 0.75) status = 'maintenance'

        plots.push({
          id: plotId,
          section: section.id,
          row: row + 1,
          number: col + 1,
          status,
          x: startX + col * (plotSize + gap),
          y: startY + row * (plotSize + gap),
          width: plotSize,
          height: plotSize,
          price: status === 'available' ? Math.floor(Math.random() * 5000) + 3000 : undefined,
          memorial: status === 'occupied' ? generateMemorial(plotId) : undefined,
        })
      }
    }
  })

  return plots
}

// Sample names for memorial generation
const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle']

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']

const epitaphs = [
  'Forever in our hearts',
  'Rest in eternal peace',
  'Gone but never forgotten',
  'A life beautifully lived',
  'Beloved by all who knew them',
  'Until we meet again',
  'In loving memory',
  'A gentle soul, now at rest',
  'Their light shines on',
  'Always remembered, always loved',
]

function generateMemorial(plotId: string): Memorial {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  const birthYear = 1920 + Math.floor(Math.random() * 60)
  const deathYear = birthYear + 40 + Math.floor(Math.random() * 50)
  
  return {
    id: `memorial-${plotId}`,
    plotId,
    name: `${firstName} ${lastName}`,
    birthDate: `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    deathDate: `${Math.min(deathYear, 2025)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    epitaph: epitaphs[Math.floor(Math.random() * epitaphs.length)],
    flowers: Math.floor(Math.random() * 50),
    visitors: Math.floor(Math.random() * 200),
    lastVisited: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const plots: Plot[] = generatePlots()

export const parkStats: ParkStats = {
  totalPlots: plots.length,
  occupiedPlots: plots.filter(p => p.status === 'occupied').length,
  availablePlots: plots.filter(p => p.status === 'available').length,
  reservedPlots: plots.filter(p => p.status === 'reserved').length,
  maintenancePlots: plots.filter(p => p.status === 'maintenance').length,
  totalVisitors: plots.reduce((acc, p) => acc + (p.memorial?.visitors || 0), 0),
  recentVisitors: Math.floor(Math.random() * 50) + 20,
  totalFlowers: plots.reduce((acc, p) => acc + (p.memorial?.flowers || 0), 0),
}

// Amenities and landmarks
export const landmarks = [
  { id: 'entrance', name: 'Main Entrance', x: 50, y: 210, icon: 'gate' },
  { id: 'chapel', name: 'Memorial Chapel', x: 420, y: 380, icon: 'building' },
  { id: 'fountain', name: 'Remembrance Fountain', x: 420, y: 130, icon: 'droplet' },
  { id: 'garden', name: 'Contemplation Garden', x: 200, y: 380, icon: 'flower' },
  { id: 'office', name: 'Administration Office', x: 620, y: 380, icon: 'building' },
  { id: 'parking', name: 'Visitor Parking', x: 50, y: 380, icon: 'car' },
]

// Paths/roads within the park
export const pathways = [
  'M50,210 L100,210 L100,140 L540,140',
  'M50,210 L100,210 L100,280 L540,280',
  'M310,80 L310,340',
  'M540,140 L540,340',
]
