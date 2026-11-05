import React from 'react';
import { ProjectLab } from '../ProjectLab';

/**
 * SelectedWork legacy alias wrapper.
 * Directly exports the unified Architectural Blueprint Exhibition component (ProjectLab).
 */
export const SelectedWork: React.FC = () => {
  return <ProjectLab />;
};

export default SelectedWork;
