import React from 'react'
import { BentoGrid, BentoGridItem } from './bento-grid'

export const BentoGridWrapper = () => {
  return (
    <section id='about'>
        <BentoGrid>
        {[{title: 'Title 1', description: 'Desc1', id: 1}].map((item) =>
        <BentoGridItem
        id={item.id}
        key={item.id}
        title={item.title}
        description={item.description}
        />
        ) }
        </BentoGrid>
    </section>
  )
}