import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";

import projectsContent from "@/content/projects-page.json";
import type { ProcessConnection, ProcessNode } from "@/content/projects";
import { getProcessConnections } from "@/content/projects";
import { formatTemplate } from "@/lib/format-template";
import {
  getConnectorLabelPosition,
  getConnectorPath,
  type ProcessNodePosition,
} from "./process-flow-layout";

type ProcessFlowProps = {
  number: string;
  title: string;
  nodes: ProcessNode[];
  projectTitle: string;
};

function nodeAnchor(id: string) {
  return `process-node-${encodeURIComponent(id)}`;
}

const processLabels = projectsContent.detail.interactionLabels.process;

function FlowConnector({
  connection,
  sourceNode,
  position,
  destinationPosition,
  sourceIndex,
  destinationIndex,
  lane,
  markerId,
}: {
  connection: ProcessConnection;
  sourceNode: ProcessNode;
  position: ProcessNodePosition;
  destinationPosition: ProcessNodePosition;
  sourceIndex: number;
  destinationIndex: number;
  lane: number;
  markerId: string;
}) {
  const isSequential = connection.kind === "sequence" && destinationIndex === sourceIndex + 1;
  const path = getConnectorPath({
    connection,
    sourceNode,
    position,
    destinationPosition,
    sourceIndex,
    destinationIndex,
    lane,
  });
  const labelPosition = getConnectorLabelPosition({
    connection,
    sourceNode,
    position,
    sourceIndex,
    destinationIndex,
    lane,
  });

  return (
    <g data-connector-label={connection.label}>
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray={isSequential ? undefined : "4 3"}
        markerEnd={`url(#${markerId})`}
        vectorEffect="non-scaling-stroke"
      >
        <title>
          {formatTemplate(
            connection.label
              ? processLabels.branchConnectionAccessibleLabelTemplate
              : processLabels.connectionAccessibleLabelTemplate,
            {
              label: connection.label ?? "",
              source: connection.source,
              destination: connection.destination,
            },
          )}
        </title>
      </path>
      {connection.label && labelPosition && (
        <text
          x={labelPosition.x}
          y={labelPosition.y}
          textAnchor={labelPosition.anchor}
          dominantBaseline="middle"
          transform={
            labelPosition.rotate
              ? `rotate(${labelPosition.rotate} ${labelPosition.x} ${labelPosition.y})`
              : undefined
          }
          fill="var(--color-foreground)"
          stroke="var(--color-card)"
          strokeWidth="5"
          strokeLinejoin="round"
          paintOrder="stroke"
          fontSize="12"
          fontFamily="var(--font-mono)"
          data-branch-label
        >
          {connection.label}
        </text>
      )}
    </g>
  );
}

function StepNode({
  node,
  number,
  isOpen,
  detailsId,
  onToggle,
}: {
  node: Extract<ProcessNode, { type: "step" }>;
  number: string;
  isOpen: boolean;
  detailsId: string;
  onToggle: () => void;
}) {
  const expandLabel = formatTemplate(processLabels.stepExpandAccessibleLabel, {
    number,
    title: node.title,
  });
  const collapseLabel = formatTemplate(processLabels.stepCollapseAccessibleLabel, {
    number,
    title: node.title,
  });

  return (
    <div className="overflow-hidden rounded-md border bg-card shadow-card">
      <button
        type="button"
        className="flex min-h-16 w-full items-center gap-4 p-4 text-left sm:p-5"
        aria-label={isOpen ? collapseLabel : expandLabel}
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span className="font-mono text-sm text-accent">{number}</span>
        <span className="min-w-0 flex-1 font-display text-base font-semibold text-foreground sm:text-lg">
          {node.title}
        </span>
        <span
          className="process-caret-control"
          data-enabled={processLabels.stepCaret.enabled}
          style={
            {
              "--process-caret-box-size": `${processLabels.stepCaret.boxSize}px`,
              "--process-caret-size": `${processLabels.stepCaret.caretSize}px`,
              "--process-caret-stroke-width": processLabels.stepCaret.caretStrokeWidth,
              "--process-caret-border-radius": `${processLabels.stepCaret.borderRadius}px`,
            } as CSSProperties
          }
          aria-hidden
        >
          <ChevronDown
            className={`process-caret ${isOpen ? "process-caret-open" : ""}`}
            style={{ width: "var(--process-caret-size)", height: "var(--process-caret-size)" }}
            strokeWidth={processLabels.stepCaret.caretStrokeWidth}
            aria-hidden
          />
        </span>
      </button>
      <div
        id={detailsId}
        className="process-disclosure"
        data-open={isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="border-t px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:px-5">
            {node.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function DecisionNode({
  node,
  nodeTitles,
}: {
  node: Extract<ProcessNode, { type: "decision" }>;
  nodeTitles: Map<string, string>;
}) {
  const accessibleLabel = formatTemplate(processLabels.decisionAccessibleLabel, {
    title: node.title,
  });

  return (
    <div className="process-decision" role="group" aria-label={accessibleLabel}>
      <div className="process-decision-symbol" data-shape="hexagon">
        <div className="process-decision-heading">
          <p className="eyebrow text-[0.62rem] text-accent">{processLabels.decision}</p>
          <h3 className="mt-1 font-display text-base font-semibold text-foreground sm:text-lg">
            {node.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.body}</p>
        </div>
      </div>
      {node.branches.length > 0 && (
        <ul className="sr-only" aria-label={processLabels.decisionBranchesAccessibleLabel}>
          {node.branches.map((branch) => (
            <li key={`${branch.label}-${branch.destination}`}>
              {formatTemplate(processLabels.branchDestinationTemplate, {
                label: branch.label,
                destination: nodeTitles.get(branch.destination) ?? branch.destination,
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProcessFlow({ number, title, nodes, projectTitle }: ProcessFlowProps) {
  const connections = useMemo(
    () => getProcessConnections(nodes, projectTitle),
    [nodes, projectTitle],
  );
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [positions, setPositions] = useState<Map<string, ProcessNodePosition>>(() => new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLLIElement>());
  const markerId = `process-arrow-${useId().replace(/:/g, "")}`;
  const nodeTitles = useMemo(() => new Map(nodes.map((node) => [node.id!, node.title])), [nodes]);
  const stepNumbers = useMemo(() => {
    const numbers = new Map<string, string>();
    let number = 0;
    nodes.forEach((node) => {
      if (node.type === "step") numbers.set(node.id!, String(++number).padStart(2, "0"));
    });
    return numbers;
  }, [nodes]);

  const measureNodes = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const nextPositions = new Map<string, ProcessNodePosition>();
    nodes.forEach((node) => {
      const element = nodeRefs.current.get(node.id!);
      if (!element) return;
      const shape = element.querySelector<HTMLElement>(".process-decision-symbol");
      const rect = (shape ?? element).getBoundingClientRect();
      nextPositions.set(node.id!, {
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        centerX: rect.left - containerRect.left + rect.width / 2,
        centerY: rect.top - containerRect.top + rect.height / 2,
      });
    });
    setPositions(nextPositions);
  }, [nodes]);

  useEffect(() => {
    measureNodes();
    const container = containerRef.current;
    if (!container) return;

    const observer =
      typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measureNodes);
    observer?.observe(container);
    nodeRefs.current.forEach((element) => observer?.observe(element));
    window.addEventListener("resize", measureNodes);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureNodes);
    };
  }, [measureNodes, openNode]);

  const positionsReady = nodes.every((node) => positions.has(node.id!));
  const height = containerRef.current?.getBoundingClientRect().height ?? 0;

  return (
    <section className="grid gap-4 border-t py-10 md:grid-cols-[14rem_1fr] md:gap-10 md:py-14">
      <h2 className="flex items-baseline gap-3 text-xl font-semibold">
        <span className="font-mono text-sm text-accent">{number}</span>
        {title}
      </h2>
      <div className="max-w-3xl text-[1.05rem] leading-relaxed text-muted-foreground">
        <div
          ref={containerRef}
          className="relative"
          role="group"
          aria-label={formatTemplate(processLabels.sectionAccessibleLabel, { projectTitle })}
        >
          {positionsReady && (
            <svg
              className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
              viewBox={`0 0 ${containerRef.current?.getBoundingClientRect().width ?? 0} ${height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
                </marker>
              </defs>
              {connections.map((connection, index) => {
                const position = positions.get(connection.source);
                const destinationPosition = positions.get(connection.destination);
                const sourceNode = nodes.find((node) => node.id === connection.source);
                if (!position || !destinationPosition || !sourceNode) return null;
                return (
                  <FlowConnector
                    key={`${connection.source}-${connection.destination}-${connection.label ?? index}`}
                    connection={connection}
                    sourceNode={sourceNode}
                    position={position}
                    destinationPosition={destinationPosition}
                    sourceIndex={nodes.findIndex((node) => node.id === connection.source)}
                    destinationIndex={nodes.findIndex((node) => node.id === connection.destination)}
                    lane={index}
                    markerId={markerId}
                  />
                );
              })}
            </svg>
          )}
          <ol className="process-flow-list space-y-8">
            {nodes.map((node) => (
              <li
                key={node.id!}
                id={nodeAnchor(node.id!)}
                ref={(element) => {
                  if (element) nodeRefs.current.set(node.id!, element);
                  else nodeRefs.current.delete(node.id!);
                }}
                tabIndex={-1}
                className="relative z-10"
              >
                {node.type === "step" ? (
                  <StepNode
                    node={node}
                    number={stepNumbers.get(node.id!) ?? ""}
                    isOpen={openNode === node.id}
                    detailsId={`${nodeAnchor(node.id!)}-details`}
                    onToggle={() => {
                      const id = node.id!;
                      setOpenNode((current) => (current === id ? null : id));
                    }}
                  />
                ) : (
                  <DecisionNode node={node} nodeTitles={nodeTitles} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
