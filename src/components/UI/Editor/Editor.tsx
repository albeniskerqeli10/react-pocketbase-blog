import { toolbarModules } from '../../../utils';
import { Dispatch, FC, SetStateAction } from 'react';
import QuillEditor from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type EditorProps = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
};

const Editor: FC<EditorProps> = ({ content, setContent }) => {
  return (
    <QuillEditor
      modules={toolbarModules}
      theme='snow'
      placeholder='Content'
      className='editor'
      id='editor'
      value={content}
      onChange={setContent}
    />
  );
};

export default Editor;
