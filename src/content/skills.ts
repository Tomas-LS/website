/** Skills & tools. Edit freely — each group renders as one block on the Skills page. */
export const skillGroups = [
  {
    title: "CAD Software",
    code: "01",
    items: ["SolidWorks (CSWA)", "Autodesk Fusion 360", "CATIA V5", "AutoCAD", "GD&T drawings"],
  },
  {
    title: "Mechanical Design",
    code: "02",
    items: ["Mechanism & linkage design", "FEA / static analysis", "Tolerance stack-ups", "Ergonomics & anthropometry", "Design for assembly"],
  },
  {
    title: "Prototyping & Fabrication",
    code: "03",
    items: ["FDM & SLA 3D printing", "CNC milling & turning", "TIG welding", "Laser cutting", "Workshop hand tools"],
  },
  {
    title: "Materials & Product Development",
    code: "04",
    items: ["Aluminium & steel alloys", "Engineering polymers (TPU, PETG, HDPE)", "Material selection (Ashby)", "User testing & co-design", "ISO 7176 / EN 12183 awareness"],
  },
] as const;
