'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { Project } from './ProjectDock'

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop — blurs the page behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 backdrop-blur-md bg-background/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            className="fixed z-50 rounded-3xl overflow-hidden"
            style={{
              inset: '2rem',
              backgroundColor: project.bg,
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-sm uppercase tracking-widest transition-opacity hover:opacity-100 opacity-40"
              style={{ color: project.fg, fontFamily: "'Plain Medium', sans-serif", letterSpacing: '0.1em' }}
            >
              Close
            </button>

            {/* Placeholder content — replace with real project page */}
            <div className="flex items-center justify-center h-full">
              <p
                style={{
                  color: project.fg,
                  fontFamily: "'Plain Medium', sans-serif",
                  fontSize: '72px',
                  letterSpacing: '-1.5px',
                  opacity: 0.12,
                }}
              >
                {project.name}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
