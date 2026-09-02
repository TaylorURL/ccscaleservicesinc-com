/**
 * The service list drives the services page, the home page grid, and the subject
 * line of a service request, so a service added here shows up in all three.
 *
 * `slug` is the anchor a customer lands on from search results and from the
 * footer, so renaming one breaks inbound links. Add and retire slugs; do not
 * rewrite them.
 *
 * Each service carries its own `cta`, because a button built from the service
 * name reads badly for the longer ones ("Request repair and troubleshooting"),
 * and because parts send the customer to the catalog while the rest send them
 * to the contact form.
 */

export const services = [
  {
    slug: 'calibration',
    cta: { label: 'Request a Calibration', to: '/contact' },
    name: 'Calibration',
    summary:
      'On-site calibration against certified test weights, with a certificate for your records.',
    description:
      'Scales drift. Use, temperature, and time all move them off their published accuracy, and nothing on the display says so. A calibration brings the scale back inside tolerance and leaves you a certificate showing what it read before the adjustment and what it read after. That document is what an auditor, a customer, or a state inspector asks to see.',
    points: [
      'As-found and as-left readings at every test point',
      'Certified test weights brought to the site',
      'One certificate per scale, filed by asset',
      'Fixed intervals, so every scale gets checked on time',
    ],
  },
  {
    slug: 'repair',
    cta: { label: 'Book a Repair', to: '/contact' },
    name: 'Repair and Troubleshooting',
    summary: 'For scales that read wrong, read nothing, or read differently every time.',
    description:
      "When a scale won't zero, drifts under load, or shows a corner error, the cause is usually a load cell, a junction box, or a cable that took water. Techs carry the parts that fail most often, so a good share of calls are diagnosed and fixed on the same visit.",
    points: [
      'Load cell and junction box diagnosis',
      'Cable, summing card, and indicator replacement',
      'Corner and linearity correction',
      'Common failure parts stocked on the truck',
    ],
  },
  {
    slug: 'preventive-maintenance',
    cta: { label: 'Ask About an Agreement', to: '/contact' },
    name: 'Preventive Maintenance',
    summary: 'Scheduled inspection and calibration, monthly through annual.',
    description:
      "A maintenance agreement puts your scales on a fixed schedule and leaves the tracking to us. Each visit inspects the mechanical condition, checks accuracy across the range, and flags wear while it's still wear and not a shutdown.",
    points: [
      'Intervals set per scale, not per site',
      'Flat-rate agreement pricing',
      'Mechanical inspection alongside the accuracy check',
      'Written findings after every visit',
      'Priority scheduling for agreement customers',
    ],
  },
  {
    slug: 'installation',
    cta: { label: 'Plan an Installation', to: '/contact' },
    name: 'Installation and Setup',
    summary: 'New scale installation, configuration, and verification before it goes into service.',
    description:
      'A new scale is only as good as its foundation, its wiring, and the way it was set up. Installation covers all three, plus the first calibration and a walkthrough with whoever runs it day to day.',
    points: [
      'Site and foundation review before delivery',
      'Wiring, indicator setup, and printer configuration',
      'First calibration and verification',
      'Operator walkthrough at handoff',
    ],
  },
  {
    slug: 'parts',
    cta: { label: 'Browse the Catalog', to: '/parts' },
    name: 'Parts and Supplies',
    summary:
      'Load cells, indicators, cabling, printers, and hardware for the equipment already in your plant.',
    description:
      'Parts for the brands and models in the field, whether or not we installed the scale. Send the model number and the symptom, and you get the part that fits instead of the one that nearly does.',
    points: [
      'Load cells, indicators, and junction boxes',
      'Cable, mounting hardware, and test weights',
      'Printers, ribbons, and ticket stock',
      'Model lookup when the part number has worn off',
    ],
  },
];
