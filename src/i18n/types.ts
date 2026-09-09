export type Language = 'en' | 'pt' | 'es';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

export interface Translations {
  common: {
    appTitle: string;
    appSubtitle: string;
    badgeWorldSkate: string;
    home: string;
    away: string;
    homePlayer: string;
    awayPlayer: string;
    goalkeeper: string;
    fieldPlayer: string;
    gkShort: string;
  };
  header: {
    parquetFloor: string;
    darkWhiteboard: string;
    toggleGrid: string;
    toggleBehindGoal: string;
    flipSides: string;
    resetBoard: string;
    downloadScreenshot: string;
    saveLoad: string;
    toggleFullscreen: string;
    helpTitle: string;
    quickGuideTitle: string;
    guideDrag: string;
    guideDragDesc: string;
    guideRotate: string;
    guideRotateDesc: string;
    guideBehindNet: string;
    guideBehindNetDesc: string;
    guideVectors: string;
    guideVectorsDesc: string;
    guideSequencer: string;
    guideSequencerDesc: string;
    languageSelect: string;
  };
  toolbar: {
    tools: string;
    select: string;
    selectShort: string;
    arrow: string;
    arrowShort: string;
    pass: string;
    passShort: string;
    curve: string;
    curveShort: string;
    zone: string;
    zoneShort: string;
    erase: string;
    eraseShort: string;
    clearLines: string;
    clearLinesTitle: string;
    lineColor: string;
    colors: {
      red: string;
      yellow: string;
      blue: string;
      green: string;
      orange: string;
      white: string;
    };
  };
  formations: {
    buttonTitle: string;
    menuHeader: string;
    playersCount: string;
    categories: {
      offensive: string;
      defensive: string;
      setPiece: string;
      specialTeams: string;
    };
    items: Record<
      string,
      {
        name: string;
        description: string;
      }
    >;
  };
  inspector: {
    playerNameRole: string;
    number: string;
    position: string;
    positionGK: string;
    positionFP: string;
    facingAngle: string;
    giveBall: string;
    releaseBall: string;
    snapEast: string;
    snapSouth: string;
    snapWest: string;
    snapNorth: string;
  };
  timeline: {
    prevStep: string;
    nextStep: string;
    playSequence: string;
    pause: string;
    loopPlayback: string;
    addStep: string;
    renameStep: string;
    duplicateStep: string;
    deleteStep: string;
    phase: string;
    stepPrefix: string;
    copySuffix: string;
    durations: {
      fastCut: string;
      standardPass: string;
      rotation: string;
      slowBuild: string;
    };
  };
  modal: {
    modalTitle: string;
    modalSubtitle: string;
    tabExport: string;
    tabImport: string;
    exportNote: string;
    copyJSON: string;
    copied: string;
    downloadJSON: string;
    importPlaceholder: string;
    uploadFile: string;
    cancel: string;
    loadPlay: string;
    errEmpty: string;
    errInvalid: string;
    successLoaded: string;
  };
}
