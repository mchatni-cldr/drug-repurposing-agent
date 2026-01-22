"""
Graph traversal and analysis tools
"""
from typing import List, Dict, Any, Optional
from collections import deque

def bfs_find_paths(
    graph_data: Dict[str, Any],
    start_entity: str,
    target_entity: str,
    max_depth: int = 6
) -> List[Dict[str, Any]]:
    """
    Find all paths between start and target entities using BFS
    
    Args:
        graph_data: Dictionary with 'entities' and 'relationships'
        start_entity: Starting entity name (e.g., "Semaglutide")
        target_entity: Target entity name (e.g., "Obesity")
        max_depth: Maximum path length to search
    
    Returns:
        List of paths, each containing nodes and edges
    """
    
    # Build adjacency list from relationships
    adjacency = {}
    relationship_map = {}
    
    for rel in graph_data['relationships']:
        source = rel['source']
        target = rel['target']
        
        if source not in adjacency:
            adjacency[source] = []
        adjacency[source].append(target)
        
        # Store relationship details
        edge_key = f"{source}->{target}"
        relationship_map[edge_key] = {
            'relation': rel['relation'],
            'confidence': rel.get('confidence', 0.5),
            'evidence': rel.get('evidence', 'unknown')
        }
    
    # Find entity IDs from names
    entity_map = {e['name']: e['id'] for e in graph_data['entities']}
    entity_details = {e['id']: e for e in graph_data['entities']}
    
    start_id = entity_map.get(start_entity)
    target_id = entity_map.get(target_entity)
    
    if not start_id or not target_id:
        print(f"❌ Entity not found: start={start_entity}, target={target_entity}")
        return []
    
    print(f"🔍 Searching paths: {start_entity} ({start_id}) → {target_entity} ({target_id})")
    
    # BFS to find all paths
    paths = []
    queue = deque([([start_id], [])])  # (node_path, edge_path)
    
    while queue:
        node_path, edge_path = queue.popleft()
        current = node_path[-1]
        
        # Check if we've reached target
        if current == target_id:
            # Calculate path confidence (average of edge confidences)
            confidences = [relationship_map[edge]['confidence'] for edge in edge_path]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Build path details
            path_details = {
                'nodes': node_path,
                'edges': edge_path,
                'length': len(node_path) - 1,
                'confidence': avg_confidence,
                'node_details': [entity_details[node_id] for node_id in node_path],
                'edge_details': [relationship_map[edge] for edge in edge_path]
            }
            paths.append(path_details)
            continue
        
        # Don't search beyond max depth
        if len(node_path) > max_depth:
            continue
        
        # Explore neighbors
        if current in adjacency:
            for neighbor in adjacency[current]:
                # Avoid cycles
                if neighbor not in node_path:
                    edge_key = f"{current}->{neighbor}"
                    queue.append((
                        node_path + [neighbor],
                        edge_path + [edge_key]
                    ))
    
    # Sort by confidence and path length
    paths.sort(key=lambda p: (p['confidence'], -p['length']), reverse=True)
    
    print(f"✓ Found {len(paths)} paths")
    return paths


def generate_mechanism_summary(path: Dict[str, Any]) -> str:
    """
    Generate human-readable mechanism summary from a path
    
    Args:
        path: Path dictionary from bfs_find_paths
    
    Returns:
        Summary string
    """
    steps = []
    
    for i, edge_detail in enumerate(path['edge_details']):
        source = path['node_details'][i]['name']
        target = path['node_details'][i + 1]['name']
        relation = edge_detail['relation']
        confidence = edge_detail['confidence']
        
        steps.append(f"{source} --{relation}--> {target} ({confidence:.0%} confidence)")
    
    return " → ".join(steps)


def score_repurposing_opportunity(
    path: Dict[str, Any],
    drug_entity: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Score a drug repurposing opportunity
    
    Args:
        path: Path from drug to disease
        drug_entity: Drug entity details
    
    Returns:
        Scoring details
    """
    
    # Base score from path confidence
    base_score = path['confidence']
    
    # Bonus for approved drugs (de-risked)
    approval_bonus = 0.2 if drug_entity.get('status') == 'approved' else 0
    
    # Penalty for longer paths (less direct mechanism)
    path_length_penalty = 1.0 / (1 + path['length'] * 0.1)
    
    # Combined score
    overall_score = (base_score * 0.6) + (approval_bonus * 0.2) + (path_length_penalty * 0.2)
    
    return {
        'overall_score': overall_score,
        'confidence_score': base_score,
        'approval_bonus': approval_bonus,
        'path_efficiency': path_length_penalty,
        'path_length': path['length']
    }