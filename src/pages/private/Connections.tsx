import Tree from 'react-d3-tree';
import type { CustomNodeElementProps } from 'react-d3-tree';
import { useReferralTreeQuery } from '../../services/api';
import Loader from '../../components/common/Loader';

interface NodeDatum {
    name: string;
    fullName?: string;
    email?: string;
    phone?: string;
    attributes?: { badge: 'Green' | 'Yellow'; }
    children?: NodeDatum[];
}

export default function Connections() {
    const { data, isLoading } = useReferralTreeQuery();


    // Import the type from react-d3-tree

    const renderCustomNode = (rd3tProps: CustomNodeElementProps) => {
        const nodeDatum = rd3tProps.nodeDatum as NodeDatum;
        const badge = nodeDatum?.attributes?.badge || 'green';

        const getColor = () => {
            switch (badge.toLowerCase()) {
                case 'green':
                    return '#10b981'; // Tailwind green
                case 'yellow':
                    return '#facc15'; // Tailwind yellow
                default:
                    return '#94a3b8'; // gray
            }
        };

        const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

        const tooltipText = [nodeDatum?.name, nodeDatum?.email, nodeDatum?.phone]
            .filter(Boolean)
            .join('\n');

        return (
            <g>
                <circle r={20} fill={getColor()} stroke="#334155" strokeWidth={2}>
                    <title>{tooltipText}</title>
                </circle>
                <text
                    fill="#1e293b"
                    stroke="none"
                    x={0}
                    y={hasChildren ? -25 : 35}
                    textAnchor="middle"
                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                >
                    {nodeDatum.name}
                </text>
            </g>
        );
    };

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="w-full h-[93vh] p-4 border rounded shadow bg-white">
                <Tree
                    data={data?.data}
                    translate={{ x: 400, y: 80 }}
                    orientation="vertical"
                    collapsible
                    zoomable
                    zoom={0.6}
                    scaleExtent={{ min: 0.3, max: 2 }}
                    renderCustomNodeElement={renderCustomNode}
                    pathFunc="elbow"
                />
        </div>
    );
}
