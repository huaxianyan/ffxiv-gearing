import * as React from 'react';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react-lite';
import classNames from 'clsx';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Badge } from '@rmwc/badge';
import * as G from '../game';
import { useStore } from './components/contexts';
import { RippleLazy } from './components/RippleLazy';
import { Icon } from './components/Icon';
import { Dropdown } from './components/Dropdown';
import { BadgeButton } from './components/BadgeButton';
import { JobSelector } from './JobSelector';
import { FilterPanel } from './FilterPanel';
import { LevelSyncPanel } from './LevelSyncPanel';
import { MateriaOverallPanel } from './MateriaOverallPanel';
import { SharePanel } from './SharePanel';
import { ImportPanel } from './ImportPanel';
import { SettingPanel } from './SettingPanel';
import { BisCalculatorPanel } from './BisCalculatorPanel';

export const Condition = mobxReact.observer(() => {
  const store = useStore();
  const welcoming = store.job === undefined;
  const editing = !store.isViewing && store.job !== undefined;
  const viewing = store.isViewing && store.job !== undefined;
  return (
    <div className="condition card" style={store.job === undefined ? { width: '900px' } : {}}>
      {welcoming && (
        <span className="condition_job -empty">选择一个职业开始配装</span>
      )}
      {welcoming && (
        <a
          className={classNames('condition_tip', store.promotion.get('legacyLink') && '-highlight')}
          href="./ew/"
          children="此工具已适配至《金曦之遗辉》资料片，如需使用《晓月之终途》版本请点击此处"
          onClick={store.promotion.get('legacyLink') ? () => store.promotion.off('legacyLink') : undefined}
          onMouseLeave={store.promotion.get('legacyLink') ? () => store.promotion.off('legacyLink') : undefined}
        />
      )}
      {editing && (
        <Dropdown
          label={({ ref, toggle }) => (
            <RippleLazy>
              <span ref={ref} className="condition_job" onClick={toggle}>
                <Icon className="condition_job-icon" name={'jobs/' + store.job} />
                <span className="condition_job-name">{store.schema.name}</span>
              </span>
            </RippleLazy>
          )}
          popper={() => (
            <div className="job-select-panel card">
              <JobSelector />
              <div className="job-select-panel_tip">
                中键点击职业（或右键菜单-在新标签页中打开链接）可新建一份空白配装
              </div>
            </div>
          )}
          placement="bottom-start"
          modifiers={[{ name: 'offset', options: { offset: [-4, 0] } }]}
        />
      )}
      {viewing && (
        <span className="condition_job">
          <Icon className="condition_job-icon" name={'jobs/' + store.job} />
          <span className="condition_job-name">{store.schema.name}</span>
        </span>
      )}
      {editing && <span className="condition_divider" />}
      {editing && (
        <span className="condition_level">
          <span className="condition_level-value">
            <ConditionLevelInput
              value={store.minLevel}
              onChange={value => store.setMinLevel(value)}
            />
            <span className="condition_level-separator">-</span>
            <ConditionLevelInput
              value={store.maxLevel}
              onChange={value => store.setMaxLevel(value)}
            />
          </span>
          品级
        </span>
      )}
      {editing && (
        <Dropdown
          label={({ ref, toggle }) => (
            <BadgeButton
              ref={ref}
              className="condition_button condition_filter"
              promotion="filter"
              onClick={toggle}
              children="筛选"
            />
          )}
          popper={FilterPanel}
          placement="bottom-start"
        />
      )}
      {(editing || viewing) && <span className="condition_divider" />}
      {viewing && store.schema.levelSyncable && store.syncLevelText !== undefined && (
        <>
          <span className="condition_text">
            <Icon className="condition_level-sync-icon" name="sync" />
            {store.syncLevelText}
          </span>
          <span className="condition_divider" />
        </>
      )}
      {editing && store.schema.levelSyncable && (
        <Dropdown
          label={({ ref, toggle }) => (
            <Button ref={ref} className="condition_button" onClick={toggle}>
              {store.syncLevelText !== undefined && <Icon className="condition_level-sync-icon" name="sync" />}
              {store.syncLevelText ?? '品级同步'}
            </Button>
          )}
          popper={LevelSyncPanel}
          placement="bottom-start"
        />
      )}
      {(editing || viewing) && (
        <Dropdown
          label={({ ref, toggle }) => (
            <Button ref={ref} className="condition_button badge-button" onClick={toggle}>
              魔晶石
              <Badge
                className="badge-button_badge"
                exited={store.isViewing || !store.promotion.get('materiaDetDhtOptimization')}
              />
            </Button>
          )}
          popper={MateriaOverallPanel}
          placement="bottom-start"
        />
      )}
      {editing && store.schema.mainStat && (
        <Dropdown
          label={({ ref, toggle }) => (
            <Button ref={ref} className="condition_button" onClick={toggle}>最优镶嵌</Button>
          )}
          popper={BisCalculatorPanel}
          placement="bottom-start"
        />
      )}
      <span className="condition_right">
        {editing && (
          <Dropdown
            label={({ ref, toggle }) => (
              <Button ref={ref} className="condition_button" onClick={toggle}>分享</Button>
            )}
            popper={SharePanel}
            placement="bottom-end"
          />
        )}
        {(welcoming || editing) && (
          <Dropdown
            label={({ ref, toggle }) => (
              <Button ref={ref} className="condition_button" onClick={toggle}>导入</Button>
            )}
            popper={ImportPanel}
            placement="bottom-end"
          />
        )}
        {viewing && (
          <Button
            className="condition_button"
            onClick={() => {
              store.startEditing();
              window.history.pushState(null, document.title, window.location.href.replace(/\?.*$/, ''));
            }}
            children="编辑"
          />
        )}
        {(editing || viewing) && (
          <Dropdown
            label={({ ref, toggle }) => (
              <Button ref={ref} className="condition_button condition_setting" onClick={toggle}>设置</Button>
            )}
            popper={SettingPanel}
            placement="bottom-end"
          />
        )}
        <span className="condition_divider" />
        <span className="condition_text">数据版本 {G.patches.data}</span>
      </span>
      {welcoming && <JobSelector />}
      {welcoming && (
        <a
          href="https://www.bilibili.com/video/BV1pt4y1W7pX"
          title="【视频】如何自助配装？高难本配装原理详解"
          target="_blank"
        >
          <img
            className="condition_welcome-promotion"
            src={require('../../img/BV1pt4y1W7pX.png')}
            srcSet={require('../../img/BV1pt4y1W7pX@2x.png') + ' 2x'}
            alt=""
          />
        </a>
      )}
    </div>
  );
});

const ConditionLevelInput = (() => {
  let anyInstanceFocused = false;
  let delayedChange: Function | null = null;
  return mobxReact.observer<{
    value: number,
    onChange: (value: number) => void,
  }>(({ value, onChange }) => {
    const [ inputValue, setInputValue ] = React.useState(value.toString());
    const [ prevValue, setPrevValue ] = React.useState(value);
    if (value !== prevValue) {
      setInputValue(value.toString());
      setPrevValue(value);
    }
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY !== 0) {
          (e.target as HTMLInputElement).focus();
          const delta = e.deltaY < 0 ? 5 : -5;
          setInputValue(v => (parseInt(v, 10) + delta).toString());
        }
      };
      const input = inputRef.current!;
      input.addEventListener('wheel', handleWheel, { passive: false });
      return () => input.removeEventListener('wheel', handleWheel);
    }, []);
    const handleChange = () => onChange(parseInt(inputValue, 10) || 0);
    return (
      <TextField
        inputRef={inputRef}
        className="condition_level-input mdc-text-field--compact"
        type="number"
        step="5"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
        }}
        onFocus={e => {
          e.target.select();
          anyInstanceFocused = true;
        }}
        onBlur={() => {
          setTimeout(() => {
            if (!anyInstanceFocused) {
              mobx.runInAction(() => {
                delayedChange?.();
                delayedChange = null;
                handleChange();
              });
            } else {
              delayedChange = handleChange;
            }
          }, 0);
          anyInstanceFocused = false;
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
    );
  });
})();
