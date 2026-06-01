import styled from "styled-components";

export const ComponentIntro = styled.p`
  margin: 0 0 1rem;
  line-height: 1.65;
  color: #555;
  max-width: 42rem;
`;

export const CodeExample = styled.pre`
  margin: 0 0 1.25rem;
  padding: 0.875rem 1rem;
  background: #f6f8fa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 1.55;
  overflow-x: auto;
  color: #24292f;
`;

export const Playground = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
`;

export const DemoPreview = styled.div`
  display: flex;
  align-items: center;
  min-height: 3.5rem;
  padding: 0.75rem 1rem;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
`;

export const ControlLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #555;
`;

export const ControlSelect = styled.select`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
`;

export const ControlCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #555;
  cursor: pointer;
`;

export const PropTable = styled.table`
  width: 100%;
  margin: 0 0 1.25rem;
  border-collapse: collapse;
  font-size: 0.8rem;

  th,
  td {
    padding: 0.4rem 0.6rem;
    border: 1px solid #e8e8e8;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #f6f8fa;
    font-weight: 600;
  }

  code {
    font-size: 0.75rem;
  }
`;
