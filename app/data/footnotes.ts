export interface BioLine {
  id: number
  text: string
  footnote: string
}

export const bioLines: BioLine[] = [
  {
    id: 1,
    text: 'Moscow-born product & visual designer',
    footnote: 'Studied philosophy and design in Moscow. An unlikely pairing that made complete sense. Left in 2022.',
  },
  {
    id: 2,
    text: 'Based in London since 2023',
    footnote: 'Moved to London in 2023.',
  },
  {
    id: 3,
    text: 'Currently designing at Granola',
    footnote: 'Granola is an AI meeting assistant. I work on the core product experience.',
  },
  {
    id: 4,
    text: 'Previously at Intercom, Wednesday Studio, Aaply, and Strelka Institute',
    footnote: 'From founding designer roles in small teams to working at larger companies, from studios to in-house work.',
  },
  {
    id: 5,
    text: 'Generalist background: product, visual, branding, and motion',
    footnote: 'Started in visual and brand, moved into product. The motion work happened somewhere in the middle and never fully stopped.',
  },
  {
    id: 6,
    text: 'Increasingly building as well as designing',
    footnote: 'This site is the experiment.',
  },
]
