import { ComponentProps, useState } from "react";
import * as yup from "yup";

import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  Checkbox,
  Chip,
  createFilterOptions,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ComponentType } from "../../types/ComponentType";

import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorIcon from "@mui/icons-material/Error";

import arrayMutators from "final-form-arrays";
import { Form, useField, useForm } from "react-final-form";
import { FormTextField } from "../../components/form/FormTextField";
import { SelectField } from "../../components/SelectField";
import { FormSelectField } from "../../components/form/FormSelectField";
import { types } from "../../models/pokemonTypes";
import { dieSizes, sizes, skills } from "../../models/dnd";
import { FormCheckbox } from "../../components/form/FormCheckbox";
import { FieldArray } from "react-final-form-arrays";
import { learningMethodsDescription, moves } from "../../models/moves";
import { setIn } from "final-form";
import { flatten, keys, pick, toPairs, values } from "remeda";
import { generateJsonFromFormData } from "../../models/pokemon";
import { downloadJson } from "../../models/file";

const FormTypeSelectField = ({
  name,
  label,
  disabledOptions = [],
  allowBlank = false,
  ...props
}: { disabledOptions?: string[]; allowBlank?: boolean } & ComponentProps<
  typeof FormSelectField
>) => (
  <FormSelectField name={name} label={label} {...props}>
    {allowBlank && <MenuItem value="">N/A</MenuItem>}

    {types.map((type) => (
      <MenuItem
        key={type}
        value={type}
        disabled={disabledOptions.includes(type)}
      >
        {capitalize(type)}
      </MenuItem>
    ))}
  </FormSelectField>
);

const StatsAttributeField = ({
  name,
  proficiencyFieldName,
  ...props
}: { proficiencyFieldName: string } & ComponentProps<typeof FormTextField>) => (
  <FormTextField
    name={name}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Tooltip
            title="If checked, Pokémon is proficient"
            placement="top"
            arrow
          >
            <FormCheckbox
              name={proficiencyFieldName}
              size="small"
              sx={{ padding: 0 }}
            />
          </Tooltip>
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

const LabelCheckbox = ({
  label,
  ...props
}: ComponentProps<typeof Checkbox> & { label: string }) => (
  <FormControlLabel
    control={<Checkbox size="small" {...props} />}
    label={label}
  />
);

const inputFeetUnitProps = {
  InputProps: {
    endAdornment: <InputAdornment position="end">ft.</InputAdornment>,
  },
  type: "number",
};

const FormContent = () => {
  const [abilityText, setAbilityText] = useState("");

  const form = useForm();

  const getFirstError = () =>
    flatten(
      form
        .getRegisteredFields()
        .map(
          (field) =>
            values(
              pick(form.getFieldState(field)!, ["error", "submitError"])
            ) as (string | undefined)[]
        )
    ).filter((err) => typeof err === "string")[0];

  const {
    input: { value: type1Value },
  } = useField("type1");

  const {
    input: { value: type2Value },
  } = useField("type2");

  const isMdBreakpoint = useMediaQuery((theme) =>
    (theme as any).breakpoints.down("md")
  );

  const mainBlockNumericFields = (
    <>
      <FormTextField name="sr" label="SR*" type="number" fullWidth />
      <FormTextField name="ac" label="AC*" type="number" fullWidth />
      <FormTextField
        name="baseHp"
        label={isMdBreakpoint ? "HP*" : "Base HP*"}
        type="number"
        fullWidth
      />
    </>
  );

  const mainBlockSelectFields = (
    <>
      <FormSelectField name="size" label="Size*" fullWidth>
        {sizes.map((size) => (
          <MenuItem key={size} value={size}>
            {capitalize(size)}
          </MenuItem>
        ))}
      </FormSelectField>

      <FormSelectField name="hitDie" label="Hit Die*" fullWidth>
        {dieSizes.map((die) => (
          <MenuItem key={die} value={die}>
            {die}
          </MenuItem>
        ))}
      </FormSelectField>
    </>
  );

  const speedBlockShortLabels = (
    <>
      <FormTextField
        name="walkSpd"
        label="Walk"
        fullWidth
        {...inputFeetUnitProps}
      />

      <FormTextField
        name="swimSpd"
        label="Swim"
        fullWidth
        {...inputFeetUnitProps}
      />

      <FormTextField
        name="flySpd"
        label="Fly"
        fullWidth
        {...inputFeetUnitProps}
      />
    </>
  );

  const speedBlockLongLabels = (
    <>
      <FormTextField
        name="climbSpd"
        label="Climb"
        fullWidth
        {...inputFeetUnitProps}
      />

      <FormTextField
        name="burrowSpd"
        label="Burrow"
        fullWidth
        {...inputFeetUnitProps}
      />
    </>
  );

  const statsBlockPhysicalStats = (
    <>
      <StatsAttributeField
        name="str"
        proficiencyFieldName="strProf"
        label="STR*"
        fullWidth
      />

      <StatsAttributeField
        name="dex"
        proficiencyFieldName="dexProf"
        label="DEX*"
        fullWidth
      />

      <StatsAttributeField
        name="con"
        proficiencyFieldName="conProf"
        label="CON*"
        fullWidth
      />
    </>
  );

  const statsBlockMentalStats = (
    <>
      <StatsAttributeField
        name="int"
        proficiencyFieldName="intProf"
        label="INT*"
        fullWidth
      />

      <StatsAttributeField
        name="wis"
        proficiencyFieldName="wisProf"
        label="WIS*"
        fullWidth
      />

      <StatsAttributeField
        name="cha"
        proficiencyFieldName="chaProf"
        label="CHA*"
        fullWidth
      />
    </>
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <FormTextField
          name="index"
          label="Number*"
          type="number"
          sx={{ marginTop: "10px" }}
        />

        <FormTextField
          name="name"
          label="Name*"
          fullWidth
          sx={{ marginTop: "10px" }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormTypeSelectField
          name="type1"
          label="1st Type*"
          disabledOptions={[type2Value]}
          fullWidth
        />
        <FormTypeSelectField
          name="type2"
          label="2nd Type"
          disabledOptions={[type1Value]}
          allowBlank
          fullWidth
        />
      </Stack>

      {isMdBreakpoint ? (
        <>
          <Stack direction="row" spacing={2}>
            {mainBlockNumericFields}
          </Stack>

          <Stack direction="row" spacing={2}>
            {mainBlockSelectFields}
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2}>
          {mainBlockNumericFields}
          {mainBlockSelectFields}
        </Stack>
      )}

      <Divider />

      <Typography variant="h6" gutterBottom>
        Speed
      </Typography>

      {isMdBreakpoint ? (
        <>
          <Stack direction="row" spacing={2}>
            {speedBlockShortLabels}
          </Stack>

          <Stack direction="row" spacing={2}>
            {speedBlockLongLabels}
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2}>
          {speedBlockShortLabels}
          {speedBlockLongLabels}
        </Stack>
      )}

      <Divider />

      <Typography variant="h6" gutterBottom>
        Stats
      </Typography>

      {isMdBreakpoint ? (
        <>
          <Stack direction="row" spacing={2}>
            {statsBlockPhysicalStats}
          </Stack>

          <Stack direction="row" spacing={2}>
            {statsBlockMentalStats}
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2}>
          {statsBlockPhysicalStats}
          {statsBlockMentalStats}
        </Stack>
      )}

      <Divider />

      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>

      <FieldArray name="skillProfs">
        {({ fields, meta: { error } }) => {
          const isSkillChecked = (skill: string) =>
            fields.value?.includes(skill) ?? false;

          const handleSkillChange =
            (skill: string) => (_: any, checked: boolean) => {
              if (checked) {
                if (!isSkillChecked(skill)) fields.push(skill);
                return;
              }

              if (isSkillChecked(skill)) {
                const skillIdx = fields.value.indexOf(skill);
                fields.remove(skillIdx);
              }
            };

          return (
            <>
              <Grid container>
                <Grid item xs={6}>
                  <Stack>
                    {skills
                      .slice(0, Math.ceil(skills.length / 2))
                      .map((skill) => (
                        <LabelCheckbox
                          key={skill}
                          label={skill}
                          checked={isSkillChecked(skill)}
                          onChange={handleSkillChange(skill)}
                        />
                      ))}
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack>
                    {skills.slice(Math.ceil(skills.length / 2)).map((skill) => (
                      <LabelCheckbox
                        key={skill}
                        label={skill}
                        checked={isSkillChecked(skill)}
                        onChange={handleSkillChange(skill)}
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>

              {error && (
                <Stack direction="row">
                  <ErrorIcon
                    fontSize="small"
                    sx={{
                      color: "error.main",
                      alignSelf: "center",
                      marginRight: "10px",
                    }}
                  />

                  <Typography variant="caption" sx={{ color: "error.main" }}>
                    {error}
                  </Typography>
                </Stack>
              )}
            </>
          );
        }}
      </FieldArray>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Abilities
      </Typography>

      <FieldArray name="abilities">
        {({ fields, meta: { error } }) => {
          const addAbility = (asHidden: boolean) => () => {
            fields.push({ name: abilityText, hidden: asHidden });
            setAbilityText("");
          };

          const removeAbility = (index: number) => () => fields.remove(index);

          return (
            <>
              <TextField
                label="Add an Ability"
                value={abilityText}
                onChange={(e) => setAbilityText(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Add Ability" placement="top" arrow>
                        <IconButton onClick={addAbility(false)}>
                          <AddCircleIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Add as Hidden Ability"
                        placement="top"
                        arrow
                      >
                        <IconButton onClick={addAbility(true)}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              {(fields.value?.length || 0) > 0 && (
                <Box style={{ marginTop: "10px" }}>
                  {fields.value.map((ability, index) => (
                    <Chip
                      key={`${ability}-${index}`}
                      label={
                        ability.hidden
                          ? `${ability.name} (Hidden)`
                          : ability.name
                      }
                      onDelete={removeAbility(index)}
                      sx={{ margin: "5px" }}
                    />
                  ))}
                </Box>
              )}

              {error && (
                <Stack direction="row">
                  <ErrorIcon
                    fontSize="small"
                    sx={{
                      color: "error.main",
                      alignSelf: "center",
                      marginRight: "10px",
                    }}
                  />

                  <Typography variant="caption" sx={{ color: "error.main" }}>
                    {error}
                  </Typography>
                </Stack>
              )}
            </>
          );
        }}
      </FieldArray>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Moves
      </Typography>

      <FieldArray name="moves">
        {({ fields, meta: { error } }) => {
          const createEmptyMove = () =>
            fields.push({ name: undefined, learned: undefined });

          const removeMove = (index: number) => () => fields.remove(index);

          const updateMove = (index: number, cb: (move: any) => any) =>
            fields.update(index, cb(fields.value[index]));

          const filterOptions = createFilterOptions({
            limit: 20,
          });

          return (
            <>
              {fields.value?.map(({ name, learned }, index) =>
                isMdBreakpoint ? (
                  <Box
                    padding="15px"
                    border="1px solid"
                    borderColor="divider"
                    borderRadius="5px"
                  >
                    <Autocomplete
                      value={name}
                      onChange={(_, value) =>
                        updateMove(index, (move) => ({ ...move, name: value }))
                      }
                      filterOptions={filterOptions}
                      disablePortal
                      options={moves}
                      fullWidth
                      disableClearable
                      renderInput={(params) => (
                        <TextField {...params} label="Move" />
                      )}
                      sx={{ marginBottom: 2 }}
                    />

                    <Stack
                      direction="row"
                      spacing={2}
                      key={`${name}-${learned}-${index}`}
                    >
                      <SelectField
                        value={learned}
                        onChange={(e) =>
                          updateMove(index, (move) => ({
                            ...move,
                            learned: e.target.value,
                          }))
                        }
                        label="Learning"
                        fullWidth
                      >
                        {toPairs(learningMethodsDescription).map(
                          ([value, description]) => (
                            <MenuItem key={value} value={value}>
                              {description}
                            </MenuItem>
                          )
                        )}
                      </SelectField>

                      <Button onClick={removeMove(index)}>
                        <CloseIcon />
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Stack
                    direction="row"
                    spacing={2}
                    key={`${name}-${learned}-${index}`}
                  >
                    <Autocomplete
                      value={name}
                      onChange={(_, value) =>
                        updateMove(index, (move) => ({ ...move, name: value }))
                      }
                      filterOptions={filterOptions}
                      disablePortal
                      options={moves}
                      fullWidth
                      disableClearable
                      renderInput={(params) => (
                        <TextField {...params} label="Move" />
                      )}
                    />

                    <SelectField
                      value={learned}
                      onChange={(e) =>
                        updateMove(index, (move) => ({
                          ...move,
                          learned: e.target.value,
                        }))
                      }
                      label="Learning"
                      fullWidth
                    >
                      {toPairs(learningMethodsDescription).map(
                        ([value, description]) => (
                          <MenuItem key={value} value={value}>
                            {description}
                          </MenuItem>
                        )
                      )}
                    </SelectField>

                    <Button onClick={removeMove(index)}>
                      <CloseIcon />
                    </Button>
                  </Stack>
                )
              )}

              <Button
                variant="outlined"
                sx={{
                  height: "55px",
                  color: "white",
                  borderColor: "white",
                  opacity: "70%",
                  borderStyle: "dashed",
                  transition: "100ms",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "#00000000",
                    opacity: "90%",
                    borderStyle: "dashed",
                  },
                }}
                onClick={createEmptyMove}
              >
                Add a Move
              </Button>

              {error && (
                <Stack direction="row">
                  <ErrorIcon
                    fontSize="small"
                    sx={{
                      color: "error.main",
                      alignSelf: "center",
                      marginRight: "10px",
                    }}
                  />

                  <Typography variant="caption" sx={{ color: "error.main" }}>
                    {error}
                  </Typography>
                </Stack>
              )}
            </>
          );
        }}
      </FieldArray>

      <Divider />

      <Button
        size="large"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          const error = getFirstError();

          if (!error) {
            form.submit();
            return;
          }

          alert(`Some form fields have errors:\n${error}`);
        }}
      >
        Generate JSON
      </Button>
    </Stack>
  );
};

const validationSchema = yup.object({
  index: yup
    .number()
    .min(0)
    .max(50000, "Number is too big, use a smaller number")
    .required(),
  name: yup.string().required().min(1).max(40, "Name is too long"),
  type1: yup
    .string()
    .oneOf(types, "Invalid type")
    .required("Must have at least one type"),
  type2: yup.string().oneOf(types, "Invalid type"),
  sr: yup.number().min(0).max(50).required(),
  ac: yup.number().min(1).max(50).required(),
  baseHp: yup.number().min(1).max(10000, "Base HP is too high").required(),
  size: yup.string().oneOf(sizes, "Invalid size").required(),
  hitDie: yup.string().oneOf(dieSizes, "Invalid die size").required(),
  walkSpeed: yup
    .number()
    .min(0)
    .max(10000, "Movement distance is too far")
    .default(0),
  swimSpeed: yup
    .number()
    .min(0)
    .max(10000, "Movement distance is too far")
    .default(0),
  flySpeed: yup
    .number()
    .min(0)
    .max(10000, "Movement distance is too far")
    .default(0),
  climbSpeed: yup
    .number()
    .min(0)
    .max(10000, "Movement distance is too far")
    .default(0),
  burrowSpeed: yup
    .number()
    .min(0)
    .max(10000, "Movement distance is too far")
    .default(0),
  str: yup.number().min(1).max(50).required(),
  dex: yup.number().min(1).max(50).required(),
  con: yup.number().min(1).max(50).required(),
  int: yup.number().min(1).max(50).required(),
  wis: yup.number().min(1).max(50).required(),
  cha: yup.number().min(1).max(50).required(),
  strProf: yup.boolean(),
  dexProf: yup.boolean(),
  conProf: yup.boolean(),
  intProf: yup.boolean(),
  wisProf: yup.boolean(),
  chaProf: yup.boolean(),
  skillProfs: yup.array(yup.string().oneOf(skills)),
  abilities: yup
    .array(
      yup.object({
        name: yup.string().min(1).max(40, "Ability name is too long"),
        hidden: yup.boolean(),
      })
    )
    .test(
      "has-unique-name",
      "Pokémon has two or more of the same ability, please remove one",
      (abilities) =>
        (abilities || [])
          .map((ability) => ability.name)
          .every(
            (ability, _i, abilityNames) =>
              abilityNames.filter((nextAbility) => nextAbility === ability)
                .length === 1
          )
    )
    .test(
      "has-one-or-less-hidden-abilities",
      "Pokémon has two or more hidden abilities, only one is allowed per Pokémon",
      (abilities) =>
        (abilities || [])
          .map((ability) => ability.hidden)
          .filter((isHidden) => !!isHidden).length <= 1
    ),
  moves: yup
    .array(
      yup.object({
        name: yup.string().oneOf(moves, "Invalid move selected"),
        learned: yup
          .string()
          .oneOf(keys(learningMethodsDescription), "Invalid learning method"),
      })
    )
    .test(
      "move-is-unique",
      "Pokémon has two or more of the same move, please remove one",
      (moves) =>
        (moves || [])
          .map((move) => move.name)
          .every(
            (move, _i, moveNames) =>
              moveNames.filter((nextMove) => nextMove === move).length === 1
          )
    )
    .test(
      "all-moves-have-learning",
      "One or more moves doesn't have a learning method selected",
      (moves) =>
        (moves || [])
          .filter((move) => typeof move?.name === "string")
          .every((move) => typeof move.learned === "string")
    ),
});

// To be passed to React Final Form
const validateFormValues = (schema: any) => async (values: any) => {
  if (typeof schema === "function") {
    schema = schema();
  }

  try {
    await schema.validate(values, { abortEarly: false });
  } catch (err: any) {
    const errors = err.inner.reduce((formError: any, innerError: any) => {
      return setIn(formError, innerError.path, innerError.message);
    }, {});

    return errors;
  }
};

const validate = validateFormValues(validationSchema);

export const PokemonCreationDialog: ComponentType<
  Omit<ComponentProps<typeof Dialog>, "children"> & {
    onClose?: () => void;
  }
> = ({ onClose, ...props }) => {
  // const isMdBreakpoint = useMediaQuery((theme) =>
  //   (theme as any).breakpoints.down("md")
  // );

  return (
    <Dialog {...props}>
      <DialogTitle>
        <Typography variant="h5" gutterBottom sx={{ lineHeight: "1" }}>
          New Pokémon
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          "&::-webkit-scrollbar": {
            width: "0.6em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.3)",
            borderRadius: "3px",
          },
        }}
      >
        <Form
          mutators={{ ...arrayMutators }}
          onSubmit={(data) => {
            const { name, json } = generateJsonFromFormData(data);
            downloadJson(name, json);
          }}
          initialValues={{
            str: "10",
            dex: "10",
            con: "10",
            int: "10",
            wis: "10",
            cha: "10",
            walkSpd: "0",
            swimSpd: "0",
            flySpd: "0",
            climbSpd: "0",
            burrowSpd: "0",
          }}
          validate={validate}
        >
          {() => (
            <form>
              <FormContent />
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
