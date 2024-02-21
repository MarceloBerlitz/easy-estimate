import React, { useState } from 'react';

import { CustomInput } from '../../../../components/CustomInput';
import { CustomButton } from '../../../../components/CustomButton';
import { useRoom } from '../../../../hooks/Room/useRoom';

type Props = {
  onJoin: (name: string) => void;
};

export const DisplayNameInput: React.FC<Props> = ({ onJoin }) => {
  const { getSavedName } = useRoom();
  const [nameState, setNameState] = useState(getSavedName());

  return (
    <>
      <h1>Easy Estimate</h1>
      <span>
        <CustomInput
          placeholder="Insert your display name"
          value={nameState}
          onChange={(e) => setNameState(e.currentTarget.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onJoin(nameState);
          }}
          size="big"
        />

        <CustomButton
          type="button"
          disabled={!nameState}
          onClick={() => onJoin(nameState)}
          size="big"
        >
          Join session
        </CustomButton>
      </span>
    </>
  );
};
