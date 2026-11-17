/**
 * Project case studies.
 *
 * To add a project: copy one object below, give it a unique `slug`,
 * and replace the text and images. Images live in src/assets/ — import them
 * at the top of this file. A gallery item without `src` renders as a labelled
 * placeholder frame (useful for CAD drawings you have not exported yet).
 */
import heroWorkshop from "@/assets/hero-workshop.jpg";
import wheelchairTray from "@/assets/project-wheelchair-tray.jpg";
import adaptiveGrip from "@/assets/project-adaptive-grip.jpg";
import foldingRamp from "@/assets/project-folding-ramp.jpg";

export type GalleryKind = "photo" | "cad" | "drawing" | "test";

export type GalleryItem = {
  src?: string;
  alt: string;
  caption: string;
  kind: GalleryKind;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  year: string;
  role: string;
  duration: string;
  context: string;
  tools: string[];
  cover: { src: string; alt: string };
  metrics: { value: string; label: string }[];
  problem: string;
  requirements: string[];
  approach: string;
  process: { title: string; body: string }[];
  fabrication: string;
  outcome: string;
  gallery: GalleryItem[];
};

export const projects: Project[] = [
  {
    slug: "modular-wheelchair-tray-mount",
    title: "Modular Wheelchair Tray & Armrest Mount",
    summary:
      "A tool-free, swing-away tray and height-adjustable armrest that clamps to most manual wheelchair frames without drilling.",
    category: "Wheelchair Adaptation",
    year: "2025",
    role: "Design lead, mechanical design & testing",
    duration: "14 weeks",
    context: "University internship — Rehabilitation Engineering Lab",
    tools: ["SolidWorks", "FEA (SolidWorks Simulation)", "CNC milling", "6061-T6 aluminium"],
    cover: {
      src: wheelchairTray,
      alt: "Manual wheelchair fitted with a swing-away tray and adjustable armrest mount",
    },
    metrics: [
      { value: "−38%", label: "Mass vs. commercial mount" },
      { value: "25 kg", label: "Tested tray load" },
      { value: "< 10 s", label: "Swing-away time" },
    ],
    problem:
      "Wheelchair users at the partner clinic relied on fixed lap trays that blocked transfers and had to be removed by a caregiver. Commercial alternatives required frame drilling, voiding manufacturer warranties.",
    requirements: [
      "Clamp to round tubes from 22 to 28 mm without permanent modification",
      "Swing clear of the user with one hand and limited grip strength",
      "Support at least 20 kg distributed load with a safety factor of 2",
      "Fit within the chair's folded envelope for car transport",
    ],
    approach:
      "I mapped transfer motions with three users and their occupational therapist, then defined a pivot location that clears the knee during side transfers. Concepts were scored against grip effort, mass and adjustability.",
    process: [
      {
        title: "Concept & user mapping",
        body: "Sketched 12 clamp and pivot concepts; three progressed to foam-core and 3D-printed mock-ups tested with users.",
      },
      {
        title: "Detailed design",
        body: "Modelled the clamp in SolidWorks with a split-collar geometry and cam lever sized for a 15 N actuation force.",
      },
      {
        title: "Analysis",
        body: "Ran static FEA on the bracket under 2× rated load and iterated pocketing to remove mass while keeping peak stress under 120 MPa.",
      },
    ],
    fabrication:
      "Brackets were CNC milled from 6061-T6 aluminium and bead-blasted; the tray surface was laser-cut from 6 mm HDPE. I produced the drawings, tolerancing and assembly instructions for the lab technician.",
    outcome:
      "Two units were deployed for a four-week trial. Users could stow the tray independently, and the clinic adopted the design as a reference for future adaptations.",
    gallery: [
      { src: wheelchairTray, alt: "Finished tray mount installed on wheelchair", caption: "Final assembly on a test chair", kind: "photo" },
      { src: heroWorkshop, alt: "Machined aluminium clamp brackets on workbench", caption: "Machined clamp brackets before anodising", kind: "photo" },
      { alt: "CAD assembly placeholder", caption: "SolidWorks assembly — exploded view", kind: "cad" },
      { alt: "FEA result placeholder", caption: "Von Mises stress plot at 2× rated load", kind: "test" },
    ],
  },
  {
    slug: "adaptive-grip-system",
    title: "Adaptive Utensil & Hand-Grip System",
    summary:
      "A family of 3D-printed, user-fitted grips that help people with limited hand function hold utensils, pens and everyday tools.",
    category: "Custom Assistive Device",
    year: "2024",
    role: "Product design, prototyping & user testing",
    duration: "10 weeks",
    context: "University internship — Occupational Therapy Partner Program",
    tools: ["Fusion 360", "FDM 3D printing", "TPU & PLA", "3D scanning"],
    cover: {
      src: adaptiveGrip,
      alt: "Flat lay of teal and white 3D-printed adaptive grips with calipers and sketches",
    },
    metrics: [
      { value: "11", label: "Iterations tested" },
      { value: "6", label: "Users fitted" },
      { value: "€4", label: "Material cost per grip" },
    ],
    problem:
      "Off-the-shelf foam grips wear out quickly and rarely fit hands affected by arthritis, cerebral palsy or spinal cord injury, forcing therapists to improvise with tape and putty.",
    requirements: [
      "Fit a range of hand sizes and grip patterns from a single parametric model",
      "Be dishwasher-safe and printable in under two hours",
      "Accept standard cutlery handles from 8 to 14 mm wide",
      "Allow a therapist to adjust fit without CAD experience",
    ],
    approach:
      "I built a parametric Fusion 360 model driven by five hand measurements, so a therapist enters values and exports a printable file. Soft TPU zones were added where users reported pressure points.",
    process: [
      { title: "Observation", body: "Shadowed therapy sessions to record grip types and failure points of existing aids." },
      { title: "Parametric modelling", body: "Created a configurable model with user-parameter tables for diameter, angle and strap position." },
      { title: "Rapid iteration", body: "Printed and tested 11 iterations with six users, refining wall thickness and strap geometry." },
    ],
    fabrication:
      "Printed on FDM machines in PLA for rigid cores and TPU 95A for contact surfaces, using a two-material print with a mechanical interlock instead of adhesive.",
    outcome:
      "The therapy team now prints personalised grips in-house. Average fitting time dropped from a full session to under 20 minutes.",
    gallery: [
      { src: adaptiveGrip, alt: "Prototype grips laid out on a cutting mat", caption: "Prototype family, iterations 4–9", kind: "photo" },
      { alt: "Parametric CAD model placeholder", caption: "Parametric model with user-parameter table", kind: "cad" },
      { alt: "Hand sketch placeholder", caption: "Early grip-pattern sketches", kind: "drawing" },
    ],
  },
  {
    slug: "portable-folding-ramp",
    title: "Lightweight Portable Folding Ramp",
    summary:
      "A two-section aluminium ramp that folds to briefcase size and gives wheelchair users step-free access to buildings with one or two steps.",
    category: "Accessibility Solution",
    year: "2024",
    role: "Structural design & field testing",
    duration: "8 weeks",
    context: "University design project with local accessibility association",
    tools: ["SolidWorks", "Hand calculations", "Sheet metal design", "Anti-slip coatings"],
    cover: {
      src: foldingRamp,
      alt: "Folding aluminium ramp deployed over concrete steps at a building entrance",
    },
    metrics: [
      { value: "9.4 kg", label: "Total mass" },
      { value: "300 kg", label: "Proof load" },
      { value: "1:6", label: "Max. gradient" },
    ],
    problem:
      "Many small shops and older buildings have one or two entrance steps but no space or budget for a permanent ramp. Existing portable ramps were heavy and hard for staff to deploy.",
    requirements: [
      "Mass under 10 kg so one person can carry and deploy it",
      "Support a powered wheelchair and user up to 250 kg",
      "Slip-resistant in wet conditions",
      "Fold to fit behind a shop counter",
    ],
    approach:
      "I sized extruded side rails using beam theory, then verified with FEA. A continuous hinge and interlocking channel let the two halves self-align when unfolded.",
    process: [
      { title: "Load case definition", body: "Defined worst-case loads from powered-chair data including dynamic factors for wheel impact." },
      { title: "Section optimisation", body: "Compared four rail profiles for stiffness-to-mass and selected a ribbed channel." },
      { title: "Field testing", body: "Deployed the prototype at three local businesses and collected feedback from users and staff." },
    ],
    fabrication:
      "Rails were cut from extruded 6063 aluminium and TIG-welded to a 2 mm deck; a grit-based anti-slip coating was applied and tested with a pendulum friction tester.",
    outcome:
      "The prototype passed a 300 kg proof load with no permanent deformation. The association is using the drawings to source a small production batch.",
    gallery: [
      { src: foldingRamp, alt: "Ramp deployed at a building entrance", caption: "Field test at a local business", kind: "photo" },
      { alt: "Ramp CAD drawing placeholder", caption: "General arrangement drawing", kind: "cad" },
      { alt: "Load test placeholder", caption: "Proof-load test set-up", kind: "test" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
