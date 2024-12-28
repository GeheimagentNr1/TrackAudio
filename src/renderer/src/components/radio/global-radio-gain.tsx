import useSessionStore from '@renderer/store/sessionStore';
import '../../style/GlobalRadio.scss';
import { useEffect, useState } from 'react';
import { Configuration } from 'src/shared/config.type';
import { useMediaQuery } from 'react-responsive';
import useRadioState from '@renderer/store/radioStore';
import { GuardFrequency, UnicomFrequency } from '../../../../shared/common';
import clsx from 'clsx';
const GlobalRadioGain = () => {
  const [radioGain, setRadioGain] = useSessionStore((state) => [
    state.radioGain,
    state.setRadioGain
  ]);

  const [radios] = useRadioState((state) => [state.radios]);
  const isWideScreen = useMediaQuery({ minWidth: '895px' });
  const [availableRadios, setAvailableRadios] = useState<boolean>(false);

  useEffect(() => {
    for (const radio of radios) {
      if (![UnicomFrequency, GuardFrequency].includes(radio.frequency) && !radio.manualGain) {
        setAvailableRadios(true);
        return;
      }
    }
    setAvailableRadios(false);
  }, [radios]);

  const setMasterGain = (newGain: number) => {
    for (const radio of radios) {
      if (![UnicomFrequency, GuardFrequency].includes(radio.frequency) && !radio.manualGain) {
        setRadioGain(newGain);
        radio.radioGain = newGain;
        window.api.SetFrequencyRadioGain(radio.frequency, newGain).catch((err: unknown) => {
          console.error(err);
        });
      }
    }
  };

  useEffect(() => {
    window.api
      .getConfig()
      .then((config: Configuration) => {
        const gain = config.radioGain || 0.5;
        const UiGain = gain * 100 || 50;

        setMasterGain(UiGain);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [setRadioGain]);

  const handleRadioGainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMasterGain(event.target.valueAsNumber);
  };

  const handleRadioGainMouseWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    const newValue = Math.min(Math.max(radioGain + (event.deltaY > 0 ? -1 : 1), 0), 100);
    setMasterGain(newValue);
  };

  return (
    <div
      className="unicom-bar-container d-flex gap-2"
      style={{
        width: isWideScreen ? '175px' : '135px'
        // marginRight: '40px'
      }}
    >
      {isWideScreen && (
        <span className="unicom-text">
          <div
            className="text-grey"
            style={{
              lineHeight: '29px'
            }}
          >
            MAIN
          </div>
        </span>
      )}
      <div
        className="d-flex w-100 h-100 align-items-center"
        style={{
          paddingRight: '10px'
        }}
      >
        <input
          type="range"
          className={clsx('form-range unicom-text global-volume-bar', {
            'no-radios': !availableRadios
          })}
          min="0"
          max="100"
          step="1"
          onChange={handleRadioGainChange}
          onWheel={handleRadioGainMouseWheel}
          value={radioGain}
          disabled={!availableRadios}
        />
      </div>
    </div>
  );
};
export default GlobalRadioGain;
