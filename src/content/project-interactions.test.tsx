import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Figure } from "@/components/site/Figure";
import { HumanStory } from "@/components/site/HumanStory";
import { ProcessFlow } from "@/components/site/ProcessFlow";
import { getConnectorLabelPosition, getConnectorPath } from "@/components/site/process-flow-layout";
import { formatTemplate } from "@/lib/format-template";
import projectsContent from "./projects-page.json";
import {
  getProcessConnections,
  prepareProcessNodes,
  projects,
  resolveProcessDestination,
} from "./projects";
import type { GalleryItem, ProcessNode } from "./projects";

const processFixture: ProcessNode[] = [
  { type: "step", title: "Observe the task", body: "Record the user workflow." },
  { type: "step", title: "Draft a concept", body: "Create an initial design." },
  {
    type: "decision",
    title: "Is the concept ready?",
    body: "Review the concept against the task.",
    branches: [
      { label: "Proceed", destination: "Deliver the design" },
      { label: "Revise", destination: "Draft a concept" },
    ],
  },
  { type: "step", title: "Deliver the design", body: "Prepare the final design." },
];

describe("project interaction content", () => {
  it("configures story copy, process nodes, and gallery back text for every project", () => {
    expect(projects.length).toBeGreaterThan(0);
    const storyAbstracts = new Set(projects.map((project) => project.humanStory.abstract));
    const storyDetails = new Set(projects.map((project) => project.humanStory.detail));
    expect(storyAbstracts.size).toBe(projects.length);
    expect(storyDetails.size).toBe(projects.length);
    for (const project of projects) {
      expect(project.humanStory.abstract).toBeTruthy();
      expect(project.humanStory.detail).toBeTruthy();
      expect(project.processFlow.length).toBeGreaterThan(0);
      for (const node of project.processFlow) {
        expect(node.title).toBeTruthy();
        if (node.type === "step") expect(node.body).toBeTruthy();
      }
      expect(project.gallery.length).toBeGreaterThan(0);
      for (const item of project.gallery) {
        expect(item.alt).toBeTruthy();
        expect(item.caption).toBeTruthy();
        expect(item.backText).toBeTruthy();
      }
    }
  });

  it("builds ordered paths and validates decision branches and backward loops", () => {
    const preparedFixture = prepareProcessNodes(processFixture);
    const connections = getProcessConnections(preparedFixture);
    const decisionIndex = preparedFixture.findIndex((node) => node.type === "decision");
    const decision = preparedFixture[decisionIndex]!;
    if (decision.type !== "decision") throw new Error("Fixture requires a decision node.");
    const forwardBranch = decision.branches.find(
      (branch) =>
        preparedFixture.findIndex(
          (node) => node.id === resolveProcessDestination(preparedFixture, branch.destination).id,
        ) > decisionIndex,
    )!;
    const backwardBranch = decision.branches.find(
      (branch) =>
        preparedFixture.findIndex(
          (node) => node.id === resolveProcessDestination(preparedFixture, branch.destination).id,
        ) < decisionIndex,
    )!;
    const forwardConnection = connections.find(
      (connection) => connection.source === decision.id && connection.label === forwardBranch.label,
    )!;
    const backwardConnection = connections.find(
      (connection) =>
        connection.source === decision.id && connection.label === backwardBranch.label,
    )!;
    const forwardDestinationIndex = preparedFixture.findIndex(
      (node) =>
        node.id === resolveProcessDestination(preparedFixture, forwardBranch.destination).id,
    );
    const backwardDestinationIndex = preparedFixture.findIndex(
      (node) =>
        node.id === resolveProcessDestination(preparedFixture, backwardBranch.destination).id,
    );

    expect(connections).toContainEqual({
      source: preparedFixture[decisionIndex - 1]!.id,
      destination: decision.id,
      kind: "sequence",
    });
    expect(forwardConnection).toEqual({
      source: decision.id,
      destination: resolveProcessDestination(preparedFixture, forwardBranch.destination).id,
      kind: "branch",
      label: forwardBranch.label,
      branchIndex: decision.branches.indexOf(forwardBranch),
      branchCount: decision.branches.length,
    });
    expect(backwardConnection).toEqual({
      source: decision.id,
      destination: resolveProcessDestination(preparedFixture, backwardBranch.destination).id,
      kind: "branch",
      label: backwardBranch.label,
      branchIndex: decision.branches.indexOf(backwardBranch),
      branchCount: decision.branches.length,
    });
    expect(
      getConnectorPath({
        connection: backwardConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        destinationPosition: {
          top: 0,
          bottom: 40,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 20,
        },
        sourceIndex: decisionIndex,
        destinationIndex: backwardDestinationIndex,
        lane: 0,
      }),
    ).toBe("M 100 150 H 12 V 20 H 100");
    expect(
      getConnectorPath({
        connection: forwardConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        destinationPosition: {
          top: 240,
          bottom: 280,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 260,
        },
        sourceIndex: decisionIndex,
        destinationIndex: forwardDestinationIndex,
        lane: 1,
      }),
    ).toBe("M 200 200 V 232");
    expect(
      getConnectorLabelPosition({
        connection: forwardConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        sourceIndex: decisionIndex,
        destinationIndex: forwardDestinationIndex,
      }),
    ).toEqual({ x: 208, y: 218, anchor: "start", rotate: 0 });
    expect(
      getConnectorLabelPosition({
        connection: backwardConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        sourceIndex: decisionIndex,
        destinationIndex: backwardDestinationIndex,
      }),
    ).toEqual({ x: 12, y: 138, anchor: "middle", rotate: -90 });

    const bottomBranch = { ...forwardConnection, branchIndex: 0 };
    expect(
      getConnectorPath({
        connection: bottomBranch,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        destinationPosition: {
          top: 0,
          bottom: 40,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 20,
        },
        sourceIndex: decisionIndex,
        destinationIndex: backwardDestinationIndex,
        lane: 0,
      }),
    ).toBe("M 200 200 V 216 H 84 V 20 H 100");
    expect(
      getConnectorPath({
        connection: bottomBranch,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        destinationPosition: {
          top: 340,
          bottom: 380,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 360,
        },
        sourceIndex: decisionIndex,
        destinationIndex: decisionIndex + 2,
        lane: 0,
      }),
    ).toBe("M 200 200 V 216 H 84 V 360 H 100");
    const rightBranchConnection = {
      ...forwardConnection,
      branchIndex: 2,
      label: "Alternate",
    };
    expect(
      getConnectorPath({
        connection: rightBranchConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        destinationPosition: {
          top: 240,
          bottom: 280,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 260,
        },
        sourceIndex: decisionIndex,
        destinationIndex: forwardDestinationIndex,
        lane: 2,
      }),
    ).toBe("M 300 150 H 348 V 260 H 316 H 300");
    expect(
      getConnectorLabelPosition({
        connection: rightBranchConnection,
        sourceNode: decision,
        position: {
          top: 100,
          bottom: 200,
          left: 100,
          right: 300,
          centerX: 200,
          centerY: 150,
        },
        sourceIndex: decisionIndex,
        destinationIndex: forwardDestinationIndex,
        lane: 2,
      }),
    ).toEqual({ x: 348, y: 138, anchor: "middle", rotate: -90 });

    const duplicateFixture = prepareProcessNodes([
      { type: "step", title: "Testing", body: "First." },
      { type: "step", title: "Testing", body: "Second." },
      { type: "step", title: "Testing", body: "Third." },
    ]);
    expect(resolveProcessDestination(duplicateFixture, "Testing").id).toBe("testing");
    expect(resolveProcessDestination(duplicateFixture, "testing").id).toBe("testing");
    expect(resolveProcessDestination(duplicateFixture, "Testing 2").id).toBe("testing-2");
    expect(resolveProcessDestination(duplicateFixture, "Testing2").id).toBe("testing-2");
    expect(resolveProcessDestination(duplicateFixture, "testing-3").id).toBe("testing-3");
    expect(resolveProcessDestination(duplicateFixture, "testing_2").id).toBe("testing-2");
    expect(resolveProcessDestination(duplicateFixture, "2").id).toBe("testing-2");
    expect(resolveProcessDestination(duplicateFixture, "testing-2").id).toBe("testing-2");
    expect(resolveProcessDestination(duplicateFixture, "02").id).toBe("testing-2");

    const tooManyBranches: ProcessNode[] = [
      {
        id: "choice",
        type: "decision",
        title: "Choose a route",
        body: "Select one route.",
        branches: Array.from({ length: 4 }, (_, index) => ({
          label: `Route ${index + 1}`,
          destination: "finish",
        })),
      },
      { id: "finish", type: "step", title: "Finish", body: "" },
    ];
    expect(() => getProcessConnections(tooManyBranches)).toThrow(/more than three branches/);
    const missingDestination: ProcessNode[] = [
      {
        id: "choice",
        type: "decision",
        title: "Choose a route",
        body: "Select one route.",
        branches: [{ label: "Continue", destination: "missing-node" }],
      },
    ];
    expect(() => getProcessConnections(missingDestination)).toThrow(/unresolved|missing node/);
  });

  it("renders configured decision shapes and labels outgoing branch arrows", () => {
    const projectTitle = "Example project";
    const processLabels = projectsContent.detail.interactionLabels.process;
    const preparedFixture = prepareProcessNodes(processFixture);
    const decision = preparedFixture.find((node) => node.type === "decision")!;
    if (decision.type !== "decision") throw new Error("Fixture requires a decision node.");
    const [forwardBranch, backwardBranch] = decision.branches;
    const backwardDestination = preparedFixture.find(
      (node) =>
        node.id ===
        resolveProcessDestination(preparedFixture, backwardBranch?.destination ?? "").id,
    )!;
    render(
      <ProcessFlow
        number="04"
        title="Design and fabrication process"
        nodes={preparedFixture}
        projectTitle={projectTitle}
      />,
    );

    expect(
      screen.getByRole("group", {
        name: formatTemplate(processLabels.sectionAccessibleLabel, {
          projectTitle,
        }),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(decision.title).closest("[data-shape]")).toHaveAttribute(
      "data-shape",
      "hexagon",
    );
    expect(
      screen.getByRole("group", {
        name: formatTemplate(processLabels.decisionAccessibleLabel, {
          title: decision.title,
        }),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(processLabels.decision)).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: processLabels.decisionBranchesAccessibleLabel }),
    ).toHaveTextContent(
      formatTemplate(processLabels.branchDestinationTemplate, {
        label: backwardBranch!.label,
        destination: backwardDestination.title,
      }),
    );
    expect(
      screen.getByText(forwardBranch!.label).closest("[data-connector-label]"),
    ).toHaveAttribute("data-connector-label", forwardBranch!.label);
    expect(
      screen.getByText(backwardBranch!.label).closest("[data-connector-label]"),
    ).toHaveAttribute("data-connector-label", backwardBranch!.label);
  });

  it("keeps only one process step expanded and allows it to collapse", () => {
    const labels = projectsContent.detail.interactionLabels.process;
    const nodes: ProcessNode[] = [
      { id: "first", type: "step", title: "First step", body: "First explanation." },
      { id: "second", type: "step", title: "Second step", body: "Second explanation." },
    ];
    render(
      <ProcessFlow
        number="04"
        title="Design and fabrication process"
        nodes={nodes}
        projectTitle="Test project"
      />,
    );

    const first = screen.getByRole("button", {
      name: formatTemplate(labels.stepExpandAccessibleLabel, { number: "01", title: "First step" }),
    });
    const second = screen.getByRole("button", {
      name: formatTemplate(labels.stepExpandAccessibleLabel, {
        number: "02",
        title: "Second step",
      }),
    });
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(first.querySelector(".process-caret-control")).toHaveAttribute("data-enabled", "true");
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", {
        name: formatTemplate(labels.stepCollapseAccessibleLabel, {
          number: "01",
          title: "First step",
        }),
      }),
    ).toBeInTheDocument();
    expect(second).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("expands and collapses the human story without replacing its abstract", () => {
    const labels = projectsContent.detail.interactionLabels.humanStory;
    const readMoreLabel = formatTemplate(labels.readMoreAccessibleLabel, {
      title: "The Human Story",
    });
    const readLessLabel = formatTemplate(labels.readLessAccessibleLabel, {
      title: "The Human Story",
    });
    render(
      <HumanStory
        number="00"
        title="The Human Story"
        story={{ abstract: "The abstract stays visible.", detail: "More context appears here." }}
      />,
    );

    const toggle = screen.getByRole("button", { name: readMoreLabel });
    expect(screen.getByText("The abstract stays visible.")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByText("The abstract stays visible.").compareDocumentPosition(toggle) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    fireEvent.click(toggle);
    const readLess = screen.getByRole("button", { name: readLessLabel });
    expect(readLess).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("More context appears here.")).toBeInTheDocument();
    expect(
      screen.getByText("More context appears here.").compareDocumentPosition(readLess) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    fireEvent.click(readLess);
    expect(screen.getByRole("button", { name: readMoreLabel })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("The abstract stays visible.")).toBeInTheDocument();
  });

  it("flips gallery images to their configured text while keeping the caption", () => {
    const labels = projectsContent.detail.interactionLabels.gallery;
    const item: GalleryItem = {
      figure: "01",
      src: "/image.jpg",
      alt: "A prototype on a table",
      caption: "Prototype overview",
      backText: "This prototype was tested with users.",
      kind: "photo",
    };
    render(<Figure item={item} />);

    const cardLabel = formatTemplate(labels.showDetailsAccessibleLabelTemplate, {
      figurePrefix: projectsContent.card.figurePrefix,
      figure: item.figure,
      caption: item.caption,
      alt: item.alt,
    });
    const imageLabel = formatTemplate(labels.showImageAccessibleLabelTemplate, {
      figurePrefix: projectsContent.card.figurePrefix,
      figure: item.figure,
      caption: item.caption,
    });
    const card = screen.getByRole("button", { name: cardLabel });
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(labels.flipForDetails)).toBeInTheDocument();
    expect(screen.getByText(labels.tapForDetails)).toBeInTheDocument();
    expect(screen.getByText("Prototype overview")).toBeInTheDocument();
    fireEvent.click(card);
    const flippedCard = screen.getByRole("button", { name: imageLabel });
    expect(flippedCard).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(labels.flipBack)).toBeInTheDocument();
    expect(screen.getByText(labels.tapToReturn)).toBeInTheDocument();
    expect(screen.getByText("This prototype was tested with users.")).toBeInTheDocument();
    fireEvent.click(flippedCard);
    expect(screen.getByRole("button", { name: cardLabel })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("also flips gallery placeholders to their configured back text", () => {
    render(
      <Figure
        item={{
          figure: "02",
          alt: "CAD drawing placeholder",
          caption: "Assembly drawing",
          backText: "The assembly drawing will be added later.",
          kind: "cad",
        }}
      />,
    );

    const card = screen.getByRole("button", { name: /Show details for Fig\. 02/ });
    expect(screen.getByRole("img", { name: "CAD drawing placeholder" })).toBeInTheDocument();
    fireEvent.click(card);
    expect(screen.getByText("The assembly drawing will be added later.")).toBeInTheDocument();
  });
});
