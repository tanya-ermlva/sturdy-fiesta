export interface BioLine {
  id: number
  text: string
  popover: {
    label: string
    title: string
    body: string
  }
}

export const bioLines: BioLine[] = [
  {
    id: 1,
    text: 'Moscow-born product & visual designer',
    popover: {
      label: 'origin',
      title: 'Philosophy & Design, Moscow',
      body: 'Studied philosophy and design in Moscow. An unlikely pairing that made complete sense. Left in 2022.',
    },
  },
  {
    id: 2,
    text: 'Based in London since 2023',
    popover: {
      label: 'location',
      title: 'London, since 2023',
      body: 'Moved to London in 2023.',
    },
  },
  {
    id: 3,
    text: 'Currently designing at Granola',
    popover: {
      label: 'current role',
      title: 'Granola',
      body: 'Granola is an AI meeting assistant. I work on the core product experience.',
    },
  },
  {
    id: 4,
    text: 'Previously at Intercom, Wednesday Studio, Aaply, and Strelka Institute',
    popover: {
      label: 'previously',
      title: 'Intercom · Wednesday Studio · Aaply · Strelka',
      body: 'From founding designer roles in small teams to working at larger companies, from studios to in-house work.',
    },
  },
  {
    id: 5,
    text: 'Generalist background: product, visual, branding, and motion',
    popover: {
      label: 'background',
      title: 'Product, Visual, Branding, Motion',
      body: 'Started in visual and brand, moved into product. The motion work happened somewhere in the middle and never fully stopped.',
    },
  },
  {
    id: 6,
    text: 'Increasingly building as well as designing',
    popover: {
      label: 'currently',
      title: 'Building things',
      body: 'This site is the experiment.',
    },
  },
]
